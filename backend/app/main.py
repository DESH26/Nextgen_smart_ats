from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.database.session import engine, Base, SessionLocal
from app.database import models
from app.services.demo_seeder import seed_demo_database

# Import API routers
from app.api.auth import router as auth_router
from app.api.jobs import router as jobs_router
from app.api.resumes import router as resumes_router
from app.api.applications import router as applications_router
from app.api.matching import router as matching_router, app_matching_router
from app.api.recruiters import router as recruiters_router
from app.api.candidates import router as candidates_router
from app.api.skill_gap import router as skill_gap_router, app_skills_router
from app.api.learning import router as learning_router, learning_resources_router
from app.api.interview import router as interview_router, app_interview_router
from app.api.analytics import router as analytics_router
from app.api.evaluation import router as evaluation_router
from app.api.admin import router as admin_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables on startup
    print("Initializing NextGen Smart ATS Database...")
    Base.metadata.create_all(bind=engine)
    
    # Seed default demonstration data if database is empty
    db = SessionLocal()
    try:
        user_count = db.query(models.User).count()
        if user_count == 0:
            seed_demo_database(db)
    except Exception as e:
        print(f"Startup seeding notice: {str(e)}")
    finally:
        db.close()
        
    yield
    print("NextGen Smart ATS Shutting Down...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.PROJECT_DESCRIPTION,
    version=settings.VERSION,
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routes
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(jobs_router, prefix=settings.API_V1_STR)
app.include_router(resumes_router, prefix=settings.API_V1_STR)
app.include_router(applications_router, prefix=settings.API_V1_STR)
app.include_router(matching_router, prefix=settings.API_V1_STR)
app.include_router(app_matching_router, prefix=settings.API_V1_STR)
app.include_router(recruiters_router, prefix=settings.API_V1_STR)
app.include_router(candidates_router, prefix=settings.API_V1_STR)
app.include_router(skill_gap_router, prefix=settings.API_V1_STR)
app.include_router(app_skills_router, prefix=settings.API_V1_STR)
app.include_router(learning_router, prefix=settings.API_V1_STR)
app.include_router(learning_resources_router, prefix=settings.API_V1_STR)
app.include_router(interview_router, prefix=settings.API_V1_STR)
app.include_router(app_interview_router, prefix=settings.API_V1_STR)
app.include_router(analytics_router, prefix=settings.API_V1_STR)
app.include_router(evaluation_router, prefix=settings.API_V1_STR)
app.include_router(admin_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "project": settings.PROJECT_NAME,
        "status": "Online & Operational",
        "version": settings.VERSION,
        "docs_url": "/docs",
        "api_prefix": settings.API_V1_STR,
        "weights_configured": {
            "semantic_similarity": f"{settings.WEIGHT_SEMANTIC * 100}%",
            "tfidf_cosine": f"{settings.WEIGHT_TFIDF * 100}%",
            "skill_coverage": f"{settings.WEIGHT_SKILL * 100}%"
        }
    }
