from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database.session import get_db
from app.database.models import User, CandidateProfile, Job, Resume, Application, ApplicationStatus, MatchScore
from app.schemas import ApplicationCreate, ApplicationResponse, ApplicationStatusUpdate
from app.api.auth import get_current_user, require_role
from app.services.ats_service import ats_service

router = APIRouter(prefix="/applications", tags=["Applications"])

@router.post("/apply", response_model=ApplicationResponse)
@router.post("", response_model=ApplicationResponse)
def apply_to_job(
    app_in: ApplicationCreate,
    current_user: User = Depends(require_role(["candidate", "admin"])),
    db: Session = Depends(get_db)
):
    candidate = db.query(CandidateProfile).filter(CandidateProfile.user_id == current_user.id).first()
    if not candidate:
        candidate = CandidateProfile(user_id=current_user.id)
        db.add(candidate)
        db.commit()
        db.refresh(candidate)
        
    job = db.query(Job).filter(Job.id == app_in.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job opening not found")
        
    resume = db.query(Resume).filter(Resume.id == app_in.resume_id, Resume.candidate_id == candidate.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
        
    # Check duplicate application
    existing = db.query(Application).filter(
        Application.job_id == app_in.job_id,
        Application.candidate_id == candidate.id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You have already applied for this job opening")
        
    application = Application(
        job_id=app_in.job_id,
        candidate_id=candidate.id,
        resume_id=app_in.resume_id,
        status=ApplicationStatus.APPLIED.value
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    
    # Automatically execute Hybrid Matching & Explainability Pipeline
    ats_service.calculate_and_save_match(application, db)
    db.refresh(application)
    
    resp = ApplicationResponse.model_validate(application)
    resp.candidate_name = current_user.full_name
    resp.candidate_email = current_user.email
    resp.job_title = job.title
    return resp

@router.get("", response_model=List[ApplicationResponse])
@router.get("/my-applications", response_model=List[ApplicationResponse])
def get_my_applications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role == "candidate":
        candidate = db.query(CandidateProfile).filter(CandidateProfile.user_id == current_user.id).first()
        if not candidate:
            return []
        apps = db.query(Application).filter(Application.candidate_id == candidate.id).order_by(desc(Application.applied_at)).all()
    else:
        apps = db.query(Application).order_by(desc(Application.applied_at)).all()
        
    results = []
    for app in apps:
        resp = ApplicationResponse.model_validate(app)
        resp.candidate_name = app.candidate.user.full_name if app.candidate and app.candidate.user else "Candidate"
        resp.candidate_email = app.candidate.user.email if app.candidate and app.candidate.user else ""
        resp.job_title = app.job.title if app.job else "Job Opening"
        results.append(resp)
    return results

@router.get("/{application_id}", response_model=ApplicationResponse)
def get_application_detail(application_id: int, db: Session = Depends(get_db)):
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    resp = ApplicationResponse.model_validate(app)
    resp.candidate_name = app.candidate.user.full_name if app.candidate and app.candidate.user else "Candidate"
    resp.candidate_email = app.candidate.user.email if app.candidate and app.candidate.user else ""
    resp.job_title = app.job.title if app.job else "Job"
    return resp

@router.patch("/{application_id}/status")
def update_application_status(
    application_id: int,
    status_update: ApplicationStatusUpdate,
    current_user: User = Depends(require_role(["recruiter", "admin"])),
    db: Session = Depends(get_db)
):
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
        
    app.status = status_update.status
    if status_update.recruiter_notes is not None:
        app.recruiter_notes = status_update.recruiter_notes
    if status_update.is_shortlisted is not None:
        app.is_shortlisted = status_update.is_shortlisted
        
    db.commit()
    return {"message": "Application updated successfully", "status": app.status, "is_shortlisted": app.is_shortlisted}
