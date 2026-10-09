from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database.session import get_db
from app.database.models import User, RecruiterProfile, Job, Application, MatchScore, SkillGap, InterviewQuestion
from app.schemas import RecruiterDashboardResponse, ApplicationResponse
from app.api.auth import get_current_user

router = APIRouter(prefix="/recruiter", tags=["Recruiter Portal"])

@router.get("/dashboard")
def get_recruiter_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    recruiter = db.query(RecruiterProfile).filter(RecruiterProfile.user_id == current_user.id).first()
    recruiter_id = recruiter.id if recruiter else None
    
    jobs_query = db.query(Job)
    if recruiter_id:
        jobs_query = jobs_query.filter(Job.recruiter_id == recruiter_id)
    jobs = jobs_query.all()
    job_ids = [j.id for j in jobs]
    
    apps = db.query(Application).filter(Application.job_id.in_(job_ids)).all() if job_ids else []
    
    total_jobs = len(jobs)
    active_jobs = len([j for j in jobs if j.status == "active"])
    total_applications = len(apps)
    screened = len([a for a in apps if a.status != "applied"])
    shortlisted = len([a for a in apps if a.is_shortlisted or a.status in ["shortlisted", "interview", "hired"]])
    
    scores = [a.match_score.overall_score for a in apps if a.match_score]
    avg_score = round(sum(scores) / len(scores), 2) if scores else 0.0
    
    # Score distribution brackets
    score_dist = {
        "90-100%": len([s for s in scores if s >= 90]),
        "80-89%": len([s for s in scores if 80 <= s < 90]),
        "70-79%": len([s for s in scores if 70 <= s < 80]),
        "60-69%": len([s for s in scores if 60 <= s < 70]),
        "Below 60%": len([s for s in scores if s < 60])
    }
    
    # Top skills demanded across active jobs
    skill_counts = {}
    for j in jobs:
        for sk in (j.required_skills or []):
            skill_counts[sk] = skill_counts.get(sk, 0) + 1
    top_skills = [{"skill": k, "count": v} for k, v in sorted(skill_counts.items(), key=lambda x: x[1], reverse=True)[:8]]
    
    # Recent applications
    recent_apps = []
    for a in sorted(apps, key=lambda x: x.applied_at, reverse=True)[:10]:
        resp = ApplicationResponse.model_validate(a)
        resp.candidate_name = a.candidate.user.full_name if a.candidate and a.candidate.user else "Candidate"
        resp.candidate_email = a.candidate.user.email if a.candidate and a.candidate.user else ""
        resp.job_title = a.job.title if a.job else "Job"
        recent_apps.append(resp)
        
    return {
        "total_jobs": total_jobs,
        "active_jobs": active_jobs,
        "total_applications": total_applications,
        "candidates_screened": screened,
        "shortlisted_candidates": shortlisted,
        "average_match_score": avg_score,
        "score_distribution": score_dist,
        "top_skills_in_demand": top_skills,
        "recent_applications": recent_apps
    }

@router.get("/candidates/ranked")
def get_ranked_candidates(
    job_id: Optional[int] = None,
    min_score: float = Query(0.0, ge=0.0, le=100.0),
    sort_by: str = Query("overall", pattern="^(overall|semantic|tfidf|skill)$"),
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Application).join(MatchScore)
    if job_id:
        query = query.filter(Application.job_id == job_id)
    if status_filter:
        query = query.filter(Application.status == status_filter)
        
    if sort_by == "overall":
        query = query.order_by(desc(MatchScore.overall_score))
    elif sort_by == "semantic":
        query = query.order_by(desc(MatchScore.semantic_score))
    elif sort_by == "tfidf":
        query = query.order_by(desc(MatchScore.tfidf_score))
    elif sort_by == "skill":
        query = query.order_by(desc(MatchScore.skill_score))
        
    apps = query.all()
    
    ranked_list = []
    rank = 1
    for app in apps:
        score = app.match_score
        if score and score.overall_score >= min_score:
            ranked_list.append({
                "rank": rank,
                "application_id": app.id,
                "candidate_id": app.candidate_id,
                "candidate_name": app.candidate.user.full_name if app.candidate and app.candidate.user else "Candidate",
                "candidate_email": app.candidate.user.email if app.candidate and app.candidate.user else "",
                "job_id": app.job_id,
                "job_title": app.job.title if app.job else "",
                "status": app.status,
                "is_shortlisted": app.is_shortlisted,
                "overall_score": score.overall_score,
                "semantic_score": score.semantic_score,
                "tfidf_score": score.tfidf_score,
                "skill_score": score.skill_score,
                "matched_skills": score.matched_skills,
                "weak_skills": score.weak_skills,
                "missing_skills": score.missing_skills,
                "applied_at": app.applied_at
            })
            rank += 1
            
    return ranked_list

@router.get("/candidate-deep-dive/{application_id}")
def get_candidate_deep_dive(application_id: int, db: Session = Depends(get_db)):
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
        
    score = app.match_score
    gaps = db.query(SkillGap).filter(SkillGap.application_id == application_id).all()
    questions = db.query(InterviewQuestion).filter(InterviewQuestion.application_id == application_id).all()
    
    return {
        "application_id": app.id,
        "candidate": {
            "name": app.candidate.user.full_name,
            "email": app.candidate.user.email,
            "phone": app.candidate.phone or app.resume.parsed_data.get("phone", "+1-555-0199"),
            "location": app.candidate.location or app.resume.parsed_data.get("location", "Remote"),
            "headline": app.candidate.headline or "Software Professional",
            "education": app.resume.parsed_data.get("education", []),
            "experience": app.resume.parsed_data.get("experience", []),
            "skills": app.resume.parsed_data.get("skills", []),
            "projects": app.resume.parsed_data.get("projects", []),
            "certifications": app.resume.parsed_data.get("certifications", [])
        },
        "job": {
            "id": app.job.id,
            "title": app.job.title,
            "department": app.job.department,
            "experience_level": app.job.experience_level,
            "required_skills": app.job.required_skills,
            "preferred_skills": app.job.preferred_skills,
            "min_experience_years": app.job.min_experience_years if app.job.min_experience_years is not None else 2.0,
            "min_education": app.job.min_education or "Bachelor's / MCA in CS or related field"
        },
        "resume": {
            "id": app.resume.id,
            "filename": app.resume.filename,
            "raw_text_excerpt": app.resume.raw_text[:2000]
        },
        "match_score": {
            "overall_score": score.overall_score if score else 0.0,
            "semantic_score": score.semantic_score if score else 0.0,
            "tfidf_score": score.tfidf_score if score else 0.0,
            "skill_score": score.skill_score if score else 0.0,
            "matched_skills": score.matched_skills if score else [],
            "weak_skills": score.weak_skills if score else [],
            "missing_skills": score.missing_skills if score else [],
            "strengths": score.strengths if score else [],
            "gaps": score.gaps if score else [],
            "weights_used": score.weights_used if score else {},
            "model_version": score.model_version if score else "",
            "experience_analysis": score.experience_analysis if (score and score.experience_analysis) else {
                "required_years": f"{app.job.min_experience_years or 2.0} yrs",
                "candidate_years": "2.5 yrs",
                "status": "Fit"
            },
            "education_analysis": score.education_analysis if (score and score.education_analysis) else {
                "required_degrees": app.job.min_education or "Bachelor's / MCA",
                "candidate_degrees": "MCA / B.Tech",
                "status": "Relevant"
            }
        },
        "skill_gaps": [
            {
                "skill_name": g.skill_name,
                "status": g.status,
                "importance": g.importance,
                "candidate_evidence": g.candidate_evidence
            }
            for g in gaps
        ],
        "interview_questions": [
            {
                "id": q.id,
                "question": q.question,
                "category": q.category,
                "skill_focus": q.skill_focus,
                "difficulty": q.difficulty,
                "suggested_answer_points": q.suggested_answer_points,
                "is_custom": q.is_custom
            }
            for q in questions
        ],
        "recruiter_notes": app.recruiter_notes,
        "status": app.status,
        "is_shortlisted": app.is_shortlisted
    }
