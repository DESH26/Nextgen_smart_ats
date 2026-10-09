from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models import User, Job, Application, MatchScore

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/recruiter")
def get_recruiter_analytics(db: Session = Depends(get_db)):
    jobs = db.query(Job).all()
    apps = db.query(Application).all()
    scores = [a.match_score.overall_score for a in apps if a.match_score]
    
    avg_score = round(sum(scores) / len(scores), 2) if scores else 0.0
    
    # Applications per job
    job_breakdown = []
    for j in jobs:
        j_apps = [a for a in apps if a.job_id == j.id]
        j_scores = [a.match_score.overall_score for a in j_apps if a.match_score]
        job_breakdown.append({
            "job_title": j.title,
            "department": j.department,
            "applications_count": len(j_apps),
            "avg_match": round(sum(j_scores) / len(j_scores), 2) if j_scores else 0.0
        })
        
    return {
        "total_jobs": len(jobs),
        "total_applications": len(apps),
        "avg_match_score": avg_score,
        "job_breakdown": job_breakdown,
        "score_distribution": {
            "90-100%": len([s for s in scores if s >= 90]),
            "80-89%": len([s for s in scores if 80 <= s < 90]),
            "70-79%": len([s for s in scores if 70 <= s < 80]),
            "60-69%": len([s for s in scores if 60 <= s < 70]),
            "<60%": len([s for s in scores if s < 60])
        }
    }
