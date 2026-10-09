from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.database.models import Application, InterviewQuestion, Job
from app.schemas import InterviewQuestionResponse, InterviewQuestionCreate
from app.ml.interview_generator import interview_generator, JOB_ROLE_QUESTION_SETS

router = APIRouter(prefix="/interview", tags=["Interview Questions"])

@router.get("/catalog")
def get_interview_question_catalog(
    domain: Optional[str] = None,
    difficulty: Optional[str] = None,
    search: Optional[str] = None
):
    catalog = interview_generator.get_full_catalog()
    filtered = catalog
    if domain and domain.lower() != "all":
        filtered = [q for q in filtered if domain.lower() in q.get("domain", "").lower() or domain.lower() in q.get("skill_focus", "").lower()]
    if difficulty and difficulty.lower() != "all":
        filtered = [q for q in filtered if q.get("difficulty", "").lower() == difficulty.lower()]
    if search:
        s = search.lower()
        filtered = [q for q in filtered if s in q.get("question", "").lower() or s in q.get("skill_focus", "").lower()]
    return filtered

@router.get("/{application_id}", response_model=List[InterviewQuestionResponse])
def get_interview_questions_for_application(application_id: int, db: Session = Depends(get_db)):
    questions = db.query(InterviewQuestion).filter(InterviewQuestion.application_id == application_id).all()
    if not questions:
        # Generate on demand if not already generated
        app = db.query(Application).filter(Application.id == application_id).first()
        if app:
            cand_skills = app.resume.parsed_data.get("skills", []) if app.resume and app.resume.parsed_data else []
            missing = app.match_score.missing_skills if app.match_score else []
            weak = app.match_score.weak_skills if app.match_score else []
            
            generated = interview_generator.generate_questions(
                job_title=app.job.title if app.job else "Software Engineer",
                candidate_skills=cand_skills,
                missing_skills=missing,
                weak_skills=weak
            )
            saved = []
            for q in generated:
                entity = InterviewQuestion(
                    application_id=application_id,
                    job_id=app.job.id if app.job else None,
                    question=q["question"],
                    category=q["category"],
                    skill_focus=q["skill_focus"],
                    difficulty=q["difficulty"],
                    suggested_answer_points=q["suggested_answer_points"],
                    is_custom=False
                )
                db.add(entity)
                saved.append(entity)
            db.commit()
            return [InterviewQuestionResponse.model_validate(s) for s in saved]
    return [InterviewQuestionResponse.model_validate(q) for q in questions]

@router.post("/generate")
def generate_ad_hoc_questions(
    job_title: str = "Software Engineer",
    candidate_skills: List[str] = [],
    missing_skills: List[str] = [],
    weak_skills: List[str] = []
):
    questions = interview_generator.generate_questions(
        job_title=job_title,
        candidate_skills=candidate_skills,
        missing_skills=missing_skills,
        weak_skills=weak_skills
    )
    return questions

@router.post("/custom", response_model=InterviewQuestionResponse)
def add_custom_question(
    application_id: int,
    q_in: InterviewQuestionCreate,
    db: Session = Depends(get_db)
):
    q = InterviewQuestion(
        application_id=application_id,
        question=q_in.question,
        category=q_in.category,
        skill_focus=q_in.skill_focus,
        difficulty=q_in.difficulty,
        suggested_answer_points=q_in.suggested_answer_points or [],
        is_custom=True
    )
    db.add(q)
    db.commit()
    db.refresh(q)
    return InterviewQuestionResponse.model_validate(q)

# Alias router for /api/applications/{application_id}/interview-questions
app_interview_router = APIRouter(prefix="/applications", tags=["Interview Questions"])

@app_interview_router.get("/{application_id}/interview-questions", response_model=List[InterviewQuestionResponse])
def get_app_interview_questions_alias(application_id: int, db: Session = Depends(get_db)):
    return get_interview_questions_for_application(application_id, db)

@app_interview_router.post("/{application_id}/interview-questions/generate", response_model=List[InterviewQuestionResponse])
def generate_app_interview_questions(application_id: int, db: Session = Depends(get_db)):
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
        
    cand_skills = app.resume.parsed_data.get("skills", []) if app.resume and app.resume.parsed_data else []
    missing = app.match_score.missing_skills if app.match_score else []
    weak = app.match_score.weak_skills if app.match_score else []
    
    generated = interview_generator.generate_questions(
        job_title=app.job.title if app.job else "Software Engineer",
        candidate_skills=cand_skills,
        missing_skills=missing,
        weak_skills=weak
    )
    
    db.query(InterviewQuestion).filter(InterviewQuestion.application_id == application_id).delete()
    saved = []
    for q in generated:
        entity = InterviewQuestion(
            application_id=application_id,
            job_id=app.job.id if app.job else None,
            question=q["question"],
            category=q["category"],
            skill_focus=q["skill_focus"],
            difficulty=q["difficulty"],
            suggested_answer_points=q["suggested_answer_points"],
            is_custom=False
        )
        db.add(entity)
        saved.append(entity)
    db.commit()
    return [InterviewQuestionResponse.model_validate(s) for s in saved]
