from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.database.models import User, CandidateProfile, Resume, Application, MatchScore, SkillGap
from app.schemas import CandidateDashboardResponse, ApplicationResponse
from app.api.auth import get_current_user
from app.ml.learning_recommender import get_recommendations_for_skills

router = APIRouter(prefix="/candidate", tags=["Candidate Portal"])

@router.get("/dashboard")
def get_candidate_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    candidate = db.query(CandidateProfile).filter(CandidateProfile.user_id == current_user.id).first()
    if not candidate:
        candidate = CandidateProfile(user_id=current_user.id)
        db.add(candidate)
        db.commit()
        db.refresh(candidate)
        
    resumes = db.query(Resume).filter(Resume.candidate_id == candidate.id).all()
    apps = db.query(Application).filter(Application.candidate_id == candidate.id).all()
    
    scores = [a.match_score.overall_score for a in apps if a.match_score]
    avg_score = round(sum(scores) / len(scores), 2) if scores else 0.0
    
    # Aggregated missing skills
    all_missing = []
    for a in apps:
        if a.match_score and a.match_score.missing_skills:
            all_missing.extend(a.match_score.missing_skills)
            
    top_missing = list(set(all_missing))[:5]
    resources = get_recommendations_for_skills(top_missing or ["Docker", "Kubernetes", "AWS", "Machine Learning"])
    
    recent_apps = []
    for a in sorted(apps, key=lambda x: x.applied_at, reverse=True)[:5]:
        resp = ApplicationResponse.model_validate(a)
        resp.candidate_name = current_user.full_name
        resp.candidate_email = current_user.email
        resp.job_title = a.job.title if a.job else "Job"
        recent_apps.append(resp)
        
    return {
        "candidate_name": current_user.full_name,
        "resumes_count": len(resumes),
        "applications_count": len(apps),
        "average_score": avg_score,
        "recent_applications": recent_apps,
        "top_missing_skills": top_missing,
        "suggested_resources": resources[:6]
    }
