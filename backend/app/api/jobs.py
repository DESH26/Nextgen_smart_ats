from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database.session import get_db
from app.database.models import User, RecruiterProfile, Job, Application
from app.schemas import JobCreate, JobUpdate, JobResponse
from app.api.auth import get_current_user, require_role
from app.services.ats_service import ats_service

router = APIRouter(prefix="/jobs", tags=["Jobs"])

@router.get("", response_model=List[JobResponse])
def list_jobs(
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Job)
    if status_filter:
        query = query.filter(Job.status == status_filter)
    jobs = query.order_by(desc(Job.created_at)).all()
    
    results = []
    for job in jobs:
        resp = JobResponse.model_validate(job)
        resp.applications_count = len(job.applications)
        results.append(resp)
    return results

@router.get("/{job_id}", response_model=JobResponse)
def get_job_detail(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    resp = JobResponse.model_validate(job)
    resp.applications_count = len(job.applications)
    return resp

@router.post("", response_model=JobResponse)
def create_job(
    job_in: JobCreate,
    current_user: User = Depends(require_role(["recruiter", "admin"])),
    db: Session = Depends(get_db)
):
    recruiter_profile = db.query(RecruiterProfile).filter(RecruiterProfile.user_id == current_user.id).first()
    if not recruiter_profile:
        recruiter_profile = RecruiterProfile(user_id=current_user.id, company="Tech Corp")
        db.add(recruiter_profile)
        db.commit()
        db.refresh(recruiter_profile)
        
    job = ats_service.create_job(job_in.model_dump(), recruiter_profile.id, db)
    resp = JobResponse.model_validate(job)
    resp.applications_count = 0
    return resp

@router.put("/{job_id}", response_model=JobResponse)
def update_job(
    job_id: int,
    job_update: JobUpdate,
    current_user: User = Depends(require_role(["recruiter", "admin"])),
    db: Session = Depends(get_db)
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    for key, value in job_update.model_dump(exclude_unset=True).items():
        setattr(job, key, value)
        
    db.commit()
    db.refresh(job)
    resp = JobResponse.model_validate(job)
    resp.applications_count = len(job.applications)
    return resp

@router.delete("/{job_id}")
def delete_job(
    job_id: int,
    current_user: User = Depends(require_role(["recruiter", "admin"])),
    db: Session = Depends(get_db)
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    db.delete(job)
    db.commit()
    return {"message": "Job opening deleted successfully", "job_id": job_id}

@router.get("/{job_id}/candidates")
def get_job_candidates(
    job_id: int,
    current_user: User = Depends(require_role(["recruiter", "admin"])),
    db: Session = Depends(get_db)
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return [
        {
            "application_id": app.id,
            "candidate_id": app.candidate_id,
            "candidate_name": app.candidate.user.full_name if app.candidate and app.candidate.user else "Candidate",
            "candidate_email": app.candidate.user.email if app.candidate and app.candidate.user else "",
            "overall_score": app.match_score.overall_score if app.match_score else 0.0,
            "status": app.status,
            "applied_at": app.applied_at
        }
        for app in job.applications
    ]
