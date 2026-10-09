import os
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database.models import (
    User, RecruiterProfile, CandidateProfile, Job, Resume, Application,
    MatchScore, ExtractedEntity, SkillGap, LearningResource, InterviewQuestion,
    EvaluationMetric, ApplicationStatus, SkillStatus
)
from app.nlp.document_parser import extract_text_from_file
from app.nlp.ner_extractor import parse_complete_resume, parse_job_description
from app.nlp.skill_taxonomy import extract_skills_from_text, normalize_skill
from app.ml.hybrid_scorer import hybrid_scorer
from app.ml.skill_gap_analyzer import skill_gap_analyzer
from app.ml.learning_recommender import get_recommendations_for_skills
from app.ml.interview_generator import interview_generator

class ATSService:
    @staticmethod
    def process_and_save_resume(
        file_path: str,
        filename: str,
        file_size: int,
        candidate_id: int,
        db: Session
    ) -> Resume:
        # Extract raw text
        raw_text = extract_text_from_file(file_path)
        # NLP structured parsing
        parsed_data = parse_complete_resume(raw_text)
        
        file_type = "pdf" if filename.lower().endswith(".pdf") else "docx"
        
        resume = Resume(
            candidate_id=candidate_id,
            filename=filename,
            file_path=file_path,
            file_type=file_type,
            file_size_bytes=file_size,
            raw_text=raw_text,
            parsed_data=parsed_data,
            is_active=True
        )
        db.add(resume)
        db.commit()
        db.refresh(resume)
        
        # Save individual extracted entities for fine-grained database querying
        for skill in parsed_data.get("skills", []):
            db.add(ExtractedEntity(
                resume_id=resume.id,
                entity_type="SKILL",
                entity_value=skill,
                confidence=1.0,
                section="Skills"
            ))
            
        for edu in parsed_data.get("education", []):
            db.add(ExtractedEntity(
                resume_id=resume.id,
                entity_type="EDUCATION",
                entity_value=f"{edu.get('degree')} - {edu.get('institution')}",
                confidence=0.95,
                section="Education"
            ))
            
        for exp in parsed_data.get("experience", []):
            db.add(ExtractedEntity(
                resume_id=resume.id,
                entity_type="JOB_TITLE",
                entity_value=f"{exp.get('title')} at {exp.get('company')}",
                confidence=0.90,
                section="Experience"
            ))
            
        db.commit()
        return resume

    @staticmethod
    def create_job(job_data: dict, recruiter_id: int, db: Session) -> Job:
        desc = job_data["description"]
        title = job_data["title"]
        
        extracted = parse_job_description(desc, title)
        req_skills = job_data.get("required_skills") or extracted["required_skills"]
        pref_skills = job_data.get("preferred_skills") or extracted["preferred_skills"]
        min_exp = float(job_data.get("min_experience_years") or extracted.get("min_experience_years", 2.0))
        
        job = Job(
            recruiter_id=recruiter_id,
            title=title,
            department=job_data.get("department", "Engineering"),
            experience_level=job_data.get("experience_level", "Mid-Level"),
            location=job_data.get("location", "Remote / Hybrid"),
            job_type=job_data.get("job_type", "Full-Time"),
            description=desc,
            required_skills=req_skills,
            preferred_skills=pref_skills,
            min_education=job_data.get("min_education", "Bachelor's / MCA"),
            min_experience_years=min_exp,
            responsibilities=job_data.get("responsibilities", []),
            status="active"
        )
        db.add(job)
        db.commit()
        db.refresh(job)
        return job

    @staticmethod
    def calculate_and_save_match(application: Application, db: Session) -> MatchScore:
        job = application.job
        resume = application.resume
        
        cand_skills = resume.parsed_data.get("skills", [])
        cand_education = resume.parsed_data.get("education", [])
        cand_exp_years = float(resume.parsed_data.get("total_years_experience", 2.0))
        
        req_skills = job.required_skills or []
        pref_skills = job.preferred_skills or []
        min_exp = float(job.min_experience_years or 2.0)
        min_edu = job.min_education or "Bachelor's in CS / MCA"
        
        # Run Hybrid ML Matching Engine
        match_result = hybrid_scorer.calculate_match(
            resume_text=resume.raw_text,
            jd_text=job.description,
            candidate_skills=cand_skills,
            jd_required_skills=req_skills,
            jd_preferred_skills=pref_skills,
            candidate_education=cand_education,
            candidate_exp_years=cand_exp_years,
            min_exp_years=min_exp,
            min_education=min_edu
        )
        
        # Check if MatchScore already exists
        match_score = db.query(MatchScore).filter(MatchScore.application_id == application.id).first()
        if not match_score:
            match_score = MatchScore(application_id=application.id)
            db.add(match_score)
            
        match_score.overall_score = match_result["overall_score"]
        match_score.semantic_score = match_result["semantic_score"]
        match_score.tfidf_score = match_result["tfidf_score"]
        match_score.skill_score = match_result["skill_score"]
        match_score.experience_score = match_result.get("experience_score", 100.0)
        match_score.education_score = match_result.get("education_score", 100.0)
        match_score.matched_skills = match_result["matched_skills"]
        match_score.weak_skills = match_result["weak_skills"]
        match_score.missing_skills = match_result["missing_skills"]
        match_score.strengths = match_result["strengths"]
        match_score.gaps = match_result["gaps"]
        match_score.weights_used = match_result["weights_used"]
        match_score.experience_analysis = match_result.get("experience_analysis", {})
        match_score.education_analysis = match_result.get("education_analysis", {})
        match_score.model_version = match_result["model_version"]
        match_score.calculated_at = datetime.now(timezone.utc)
        
        db.commit()
        db.refresh(match_score)
        
        # Populate Skill Gaps
        db.query(SkillGap).filter(SkillGap.application_id == application.id).delete()
        gap_items = skill_gap_analyzer.analyze_gaps(
            candidate_skills=cand_skills,
            required_skills=req_skills,
            preferred_skills=pref_skills,
            resume_text=resume.raw_text
        )
        for item in gap_items:
            db.add(SkillGap(
                application_id=application.id,
                skill_name=item["skill_name"],
                status=item["status"],
                importance=item["importance"],
                confidence=1.0,
                candidate_evidence=item["candidate_evidence"]
            ))
            
        # Generate and Save Tailored Interview Questions
        db.query(InterviewQuestion).filter(InterviewQuestion.application_id == application.id).delete()
        generated_questions = interview_generator.generate_questions(
            job_title=job.title,
            candidate_skills=cand_skills,
            missing_skills=match_result["missing_skills"],
            weak_skills=match_result["weak_skills"]
        )
        for q in generated_questions:
            db.add(InterviewQuestion(
                application_id=application.id,
                job_id=job.id,
                question=q["question"],
                category=q["category"],
                skill_focus=q["skill_focus"],
                difficulty=q["difficulty"],
                suggested_answer_points=q["suggested_answer_points"],
                is_custom=q.get("is_custom", False)
            ))
            
        db.commit()
        return match_score

ats_service = ATSService()
