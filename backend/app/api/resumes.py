import os
import shutil
from typing import List
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.database.session import get_db
from app.database.models import User, CandidateProfile, Resume
from app.schemas import ResumeResponse
from app.api.auth import get_current_user
from app.services.ats_service import ats_service

router = APIRouter(prefix="/resumes", tags=["Resumes"])

@router.post("/upload", response_model=ResumeResponse)
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "candidate":
        raise HTTPException(status_code=403, detail="Only candidates can upload resumes")
        
    # File validation
    filename = file.filename or "resume.pdf"
    ext = Path(filename).suffix.lower()
    if ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '{ext}'. Allowed formats: {', '.join(settings.ALLOWED_EXTENSIONS)}"
        )
        
    candidate_profile = db.query(CandidateProfile).filter(CandidateProfile.user_id == current_user.id).first()
    if not candidate_profile:
        candidate_profile = CandidateProfile(user_id=current_user.id)
        db.add(candidate_profile)
        db.commit()
        db.refresh(candidate_profile)
        
    # Save file safely to disk
    save_filename = f"user_{current_user.id}_{int(os.times().system * 1000)}_{filename}"
    file_path = str(settings.UPLOAD_DIR / save_filename)
    
    with open(file_path, "wb") as buffer:
        content = await file.read()
        if len(content) > settings.MAX_FILE_SIZE_MB * 1024 * 1024:
            raise HTTPException(status_code=400, detail=f"File exceeds maximum allowed size of {settings.MAX_FILE_SIZE_MB}MB")
        buffer.write(content)
        
    try:
        resume = ats_service.process_and_save_resume(
            file_path=file_path,
            filename=filename,
            file_size=len(content),
            candidate_id=candidate_profile.id,
            db=db
        )
        return ResumeResponse.model_validate(resume)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Resume processing failed: {str(e)}")

@router.get("/my-resumes", response_model=List[ResumeResponse])
def get_my_resumes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    candidate = db.query(CandidateProfile).filter(CandidateProfile.user_id == current_user.id).first()
    if not candidate:
        return []
    resumes = db.query(Resume).filter(Resume.candidate_id == candidate.id).order_by(Resume.uploaded_at.desc()).all()
    return [ResumeResponse.model_validate(r) for r in resumes]

@router.get("/{resume_id}", response_model=ResumeResponse)
def get_resume(resume_id: int, db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return ResumeResponse.model_validate(resume)
