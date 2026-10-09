from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional

from app.database.session import get_db
from app.database.models import Application, MatchScore
from app.schemas import MatchScoreResponse
from app.ml.hybrid_scorer import hybrid_scorer
from app.services.ats_service import ats_service

router = APIRouter(prefix="/matching", tags=["Matching Engine"])

class AdHocAnalyzeRequest(BaseModel):
    resume_text: str
    job_description: str
    candidate_skills: Optional[List[str]] = []
    required_skills: Optional[List[str]] = []
    preferred_skills: Optional[List[str]] = []

@router.get("/{application_id}", response_model=MatchScoreResponse)
def get_match_score(application_id: int, db: Session = Depends(get_db)):
    score = db.query(MatchScore).filter(MatchScore.application_id == application_id).first()
    if not score:
        # If score not found, compute on the fly
        app = db.query(Application).filter(Application.id == application_id).first()
        if not app:
            raise HTTPException(status_code=404, detail="Application not found")
        score = ats_service.calculate_and_save_match(app, db)
    return MatchScoreResponse.model_validate(score)

@router.post("/analyze")
def analyze_ad_hoc(req: AdHocAnalyzeRequest):
    """Real-time semantic matching sandbox for testing any arbitrary resume/JD pair."""
    result = hybrid_scorer.calculate_match(
        resume_text=req.resume_text,
        jd_text=req.job_description,
        candidate_skills=req.candidate_skills or [],
        jd_required_skills=req.required_skills or [],
        jd_preferred_skills=req.preferred_skills or []
    )
    return result

# Router alias for /api/applications/{application_id}/analyze & /match
app_matching_router = APIRouter(prefix="/applications", tags=["Matching Engine"])

@app_matching_router.post("/{application_id}/analyze", response_model=MatchScoreResponse)
@app_matching_router.get("/{application_id}/match", response_model=MatchScoreResponse)
def analyze_application_match(application_id: int, db: Session = Depends(get_db)):
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    score = ats_service.calculate_and_save_match(app, db)
    return MatchScoreResponse.model_validate(score)
