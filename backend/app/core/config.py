import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
PROJECT_ROOT = BASE_DIR.parent
DATA_DIR = PROJECT_ROOT / "data"
UPLOAD_DIR = DATA_DIR / "uploads"
SAMPLE_RESUMES_DIR = DATA_DIR / "sample_resumes"

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
SAMPLE_RESUMES_DIR.mkdir(parents=True, exist_ok=True)

class Settings:
    PROJECT_NAME: str = "NextGen Smart ATS"
    PROJECT_DESCRIPTION: str = "NLP & Machine Learning Based Applicant Tracking System with Semantic Matching, Skill Gap Analysis, and Interview Question Suggestion"
    VERSION: str = "2.0.0"
    API_V1_STR: str = "/api"
    
    # Paths
    BASE_DIR: Path = BASE_DIR
    PROJECT_ROOT: Path = PROJECT_ROOT
    DATA_DIR: Path = DATA_DIR
    UPLOAD_DIR: Path = UPLOAD_DIR
    SAMPLE_RESUMES_DIR: Path = SAMPLE_RESUMES_DIR
    
    # Security & Auth
    SECRET_KEY: str = os.getenv("SECRET_KEY", "smart-ats-super-secret-mca-project-key-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database (Neon PostgreSQL)
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://neondb_owner:npg_GesE69MqDujw@ep-fancy-frog-b3wlt4y5-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
    )
    
    # Matching Weights (Configurable in Backend & Explained in Viva)
    WEIGHT_SEMANTIC: float = float(os.getenv("WEIGHT_SEMANTIC", "0.40"))
    WEIGHT_TFIDF: float = float(os.getenv("WEIGHT_TFIDF", "0.30"))
    WEIGHT_SKILL: float = float(os.getenv("WEIGHT_SKILL", "0.30"))
    
    # Sentence-BERT Embedding Model
    SBERT_MODEL_NAME: str = "all-MiniLM-L6-v2"
    USE_SBERT_FALLBACK_ON_ERROR: bool = True
    
    # File Upload Limits
    MAX_FILE_SIZE_MB: int = 10
    ALLOWED_EXTENSIONS: set = {".pdf", ".docx"}
    
    # CORS
    CORS_ORIGINS: list = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8000",
        "*"
    ]

settings = Settings()
