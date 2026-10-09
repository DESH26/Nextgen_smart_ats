import enum
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey, Enum, JSON
from sqlalchemy.orm import relationship
from app.database.session import Base

class UserRole(str, enum.Enum):
    RECRUITER = "recruiter"
    CANDIDATE = "candidate"
    ADMIN = "admin"

class ApplicationStatus(str, enum.Enum):
    APPLIED = "applied"
    SCREENING = "screening"
    SHORTLISTED = "shortlisted"
    INTERVIEW = "interview"
    REJECTED = "rejected"
    HIRED = "hired"

class SkillStatus(str, enum.Enum):
    MATCHED = "matched"
    WEAK = "weak"
    MISSING = "missing"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default=UserRole.CANDIDATE.value, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # Relationships
    recruiter_profile = relationship("RecruiterProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    candidate_profile = relationship("CandidateProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")

class RecruiterProfile(Base):
    __tablename__ = "recruiter_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    company = Column(String(255), nullable=False, default="Tech Corp")
    title = Column(String(255), default="Talent Acquisition Specialist") # Designation
    department = Column(String(255), default="Human Resources")
    phone = Column(String(50), nullable=True)
    
    user = relationship("User", back_populates="recruiter_profile")
    jobs = relationship("Job", back_populates="recruiter", cascade="all, delete-orphan")

class CandidateProfile(Base):
    __tablename__ = "candidate_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    phone = Column(String(50), nullable=True)
    location = Column(String(255), nullable=True)
    headline = Column(String(255), nullable=True)
    bio = Column(Text, nullable=True)
    portfolio_url = Column(String(255), nullable=True)
    github_url = Column(String(255), nullable=True)
    linkedin_url = Column(String(255), nullable=True)
    
    user = relationship("User", back_populates="candidate_profile")
    resumes = relationship("Resume", back_populates="candidate", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="candidate", cascade="all, delete-orphan")

class Job(Base):
    __tablename__ = "jobs"
    
    id = Column(Integer, primary_key=True, index=True)
    recruiter_id = Column(Integer, ForeignKey("recruiter_profiles.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False, index=True)
    department = Column(String(255), nullable=False, default="Engineering")
    experience_level = Column(String(50), default="Mid-Level") # Entry-Level, Mid-Level, Senior
    location = Column(String(255), default="Remote / Hybrid")
    job_type = Column(String(50), default="Full-Time")
    description = Column(Text, nullable=False)
    
    # Requirements extracted and specified
    required_skills = Column(JSON, default=list)  # List of strings e.g. ["Python", "Machine Learning", "SQL"]
    preferred_skills = Column(JSON, default=list) # List of strings e.g. ["Docker", "AWS", "PyTorch"]
    min_education = Column(String(255), default="Bachelor's in Computer Science or related MCA/B.Tech")
    min_experience_years = Column(Float, default=2.0)
    responsibilities = Column(JSON, default=list)
    
    status = Column(String(50), default="active") # active, closed, draft
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    recruiter = relationship("RecruiterProfile", back_populates="jobs")
    applications = relationship("Application", back_populates="job", cascade="all, delete-orphan")
    interview_questions = relationship("InterviewQuestion", back_populates="job", cascade="all, delete-orphan")

class Resume(Base):
    __tablename__ = "resumes"
    
    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidate_profiles.id", ondelete="CASCADE"), nullable=False)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_type = Column(String(50), default="pdf") # pdf, docx
    file_size_bytes = Column(Integer, default=0)
    
    raw_text = Column(Text, nullable=False)
    
    # Parsed structured data
    parsed_data = Column(JSON, default=dict) 
    
    is_active = Column(Boolean, default=True)
    uploaded_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    candidate = relationship("CandidateProfile", back_populates="resumes")
    applications = relationship("Application", back_populates="resume")
    extracted_entities = relationship("ExtractedEntity", back_populates="resume", cascade="all, delete-orphan")

class Application(Base):
    __tablename__ = "applications"
    
    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    candidate_id = Column(Integer, ForeignKey("candidate_profiles.id", ondelete="CASCADE"), nullable=False)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False)
    
    status = Column(String(50), default=ApplicationStatus.APPLIED.value)
    recruiter_notes = Column(Text, nullable=True)
    is_shortlisted = Column(Boolean, default=False)
    applied_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    job = relationship("Job", back_populates="applications")
    candidate = relationship("CandidateProfile", back_populates="applications")
    resume = relationship("Resume", back_populates="applications")
    match_score = relationship("MatchScore", back_populates="application", uselist=False, cascade="all, delete-orphan")
    skill_gaps = relationship("SkillGap", back_populates="application", cascade="all, delete-orphan")
    interview_questions = relationship("InterviewQuestion", back_populates="application", cascade="all, delete-orphan")

class MatchScore(Base):
    __tablename__ = "match_scores"
    
    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    # 0 to 100 percentages
    overall_score = Column(Float, nullable=False, default=0.0)
    semantic_score = Column(Float, nullable=False, default=0.0) # SBERT similarity
    tfidf_score = Column(Float, nullable=False, default=0.0)    # TF-IDF cosine similarity
    skill_score = Column(Float, nullable=False, default=0.0)    # Skill coverage percentage
    experience_score = Column(Float, default=100.0)            # Experience alignment percentage
    education_score = Column(Float, default=100.0)             # Education relevance percentage
    
    # Breakdown details for explainability
    matched_skills = Column(JSON, default=list) # Skills present
    weak_skills = Column(JSON, default=list)    # Partial/context matches
    missing_skills = Column(JSON, default=list) # Missing required skills
    
    strengths = Column(JSON, default=list)      # Highlighting strong matches
    gaps = Column(JSON, default=list)           # Highlighting potential gaps
    weights_used = Column(JSON, default=dict)   # {semantic: 0.4, tfidf: 0.3, skill: 0.3}
    
    experience_analysis = Column(JSON, default=dict) # {"required": "2+ yrs", "detected": "3 yrs", "status": "Strong"}
    education_analysis = Column(JSON, default=dict)  # {"required": "MCA/B.Tech", "detected": "MCA", "status": "Relevant"}
    
    model_version = Column(String(100), default="all-MiniLM-L6-v2 + TFIDF-Ngram")
    calculated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    application = relationship("Application", back_populates="match_score")

class ExtractedEntity(Base):
    __tablename__ = "extracted_entities"
    
    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False)
    entity_type = Column(String(50), nullable=False) # SKILL, EDUCATION, EXPERIENCE, JOB_TITLE, CERTIFICATION, CONTACT
    entity_value = Column(String(255), nullable=False)
    confidence = Column(Float, default=1.0)
    section = Column(String(100), nullable=True) # Summary, Experience, Education, Skills, etc.
    
    resume = relationship("Resume", back_populates="extracted_entities")

class SkillGap(Base):
    __tablename__ = "skill_gaps"
    
    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id", ondelete="CASCADE"), nullable=False)
    skill_name = Column(String(100), nullable=False)
    status = Column(String(50), nullable=False) # matched, weak, missing
    importance = Column(String(50), default="required") # required, preferred
    confidence = Column(Float, default=1.0)
    candidate_evidence = Column(Text, nullable=True) # Excerpt or evidence from resume
    
    application = relationship("Application", back_populates="skill_gaps")

class LearningResource(Base):
    __tablename__ = "learning_resources"
    
    id = Column(Integer, primary_key=True, index=True)
    skill_name = Column(String(100), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    provider = Column(String(100), nullable=False) # Coursera, freeCodeCamp, Official Docs, YouTube, Udemy, Kaggle
    url = Column(String(500), nullable=False)
    resource_type = Column(String(50), default="Course") # Course, Documentation, Tutorial, Interactive
    difficulty = Column(String(50), default="Beginner") # Beginner, Intermediate, Advanced
    description = Column(Text, nullable=True)
    estimated_hours = Column(Integer, default=10)

class InterviewQuestion(Base):
    __tablename__ = "interview_questions"
    
    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id", ondelete="CASCADE"), nullable=True)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=True)
    
    question = Column(Text, nullable=False)
    category = Column(String(50), nullable=False) # technical, behavioral, skill_gap
    skill_focus = Column(String(100), nullable=True)
    difficulty = Column(String(50), default="Medium") # Easy, Medium, Hard
    suggested_answer_points = Column(JSON, default=list) # List of bullet points
    is_custom = Column(Boolean, default=False)
    
    application = relationship("Application", back_populates="interview_questions")
    job = relationship("Job", back_populates="interview_questions")

class EvaluationMetric(Base):
    __tablename__ = "evaluation_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    metric_name = Column(String(100), nullable=False) # NER_SKILL, NER_EDUCATION, TFIDF_COSINE, SBERT_SEMANTIC, HYBRID_ACCURACY
    precision = Column(Float, default=0.0)
    recall = Column(Float, default=0.0)
    f1_score = Column(Float, default=0.0)
    sample_size = Column(Integer, default=50)
    latency_ms = Column(Float, default=0.0)
    notes = Column(Text, nullable=True)
    evaluated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
