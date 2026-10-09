from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.database.models import Application, SkillGap
from app.schemas import SkillGapResponse

router = APIRouter(prefix="/skill-gap", tags=["Skill Gap Analysis"])

@router.get("/{application_id}", response_model=List[SkillGapResponse])
def get_skill_gaps_for_application(application_id: int, db: Session = Depends(get_db)):
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
        
    gaps = db.query(SkillGap).filter(SkillGap.application_id == application_id).all()
    return [SkillGapResponse.model_validate(g) for g in gaps]

# Alias for /api/applications/{application_id}/skill-gaps
app_skills_router = APIRouter(prefix="/applications", tags=["Skill Gap Analysis"])

@app_skills_router.get("/{application_id}/skill-gaps", response_model=List[SkillGapResponse])
def get_application_skill_gaps_alias(application_id: int, db: Session = Depends(get_db)):
    return get_skill_gaps_for_application(application_id, db)
