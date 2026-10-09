from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.database.models import LearningResource
from app.schemas import LearningResourceResponse
from app.ml.learning_recommender import get_recommendations_for_skills, RESOURCE_DATABASE

router = APIRouter(prefix="/learning", tags=["Learning Resources"])

@router.get("/recommendations")
def get_learning_recommendations(
    skills: Optional[List[str]] = Query(None, description="List or comma-delimited string of skills to get recommendations for")
):
    if not skills:
        return get_recommendations_for_skills([])
    
    parsed_skills: List[str] = []
    for s in skills:
        if not s:
            continue
        if "," in s:
            parsed_skills.extend([part.strip() for part in s.split(",") if part.strip()])
        else:
            parsed_skills.append(s.strip())
            
    resources = get_recommendations_for_skills(parsed_skills)
    return resources

@router.get("/resources", response_model=List[dict])
def get_all_learning_catalog():
    flattened = []
    for skill, items in RESOURCE_DATABASE.items():
        for item in items:
            flattened.append({**item, "skill_name": skill})
    return flattened

@router.get("/{skill_name}")
def get_learning_for_skill(skill_name: str):
    resources = get_recommendations_for_skills([skill_name])
    return resources

# Root alias for /api/learning-resources
learning_resources_router = APIRouter(prefix="/learning-resources", tags=["Learning Resources"])

@learning_resources_router.get("", response_model=List[dict])
def get_learning_resources_root():
    return get_all_learning_catalog()
