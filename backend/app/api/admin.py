from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models import User, Job, Application, Resume
from app.services.demo_seeder import seed_demo_database

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/system-stats")
def get_system_stats(db: Session = Depends(get_db)):
    users_count = db.query(User).count()
    jobs_count = db.query(Job).count()
    resumes_count = db.query(Resume).count()
    apps_count = db.query(Application).count()
    
    return {
        "total_users": users_count,
        "total_jobs": jobs_count,
        "total_resumes": resumes_count,
        "total_applications": apps_count,
        "system_status": "Healthy / Operational",
        "nlp_engine": "Active (Taxonomy + TF-IDF + SBERT Embeddings)",
        "database": "SQLite Relational Storage"
    }

@router.get("/users")
def list_all_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return [
        {
            "id": u.id,
            "email": u.email,
            "full_name": u.full_name,
            "role": u.role,
            "is_active": u.is_active,
            "created_at": u.created_at
        }
        for u in users
    ]

@router.post("/reseed-db")
def reseed_database(db: Session = Depends(get_db)):
    seed_demo_database(db)
    return {"message": "Database successfully populated with MCA Viva demo dataset!"}
