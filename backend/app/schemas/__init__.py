from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

# User & Auth Schemas
class UserBase(BaseModel):
    email: str
    full_name: str
    role: str = "candidate"

class UserCreate(UserBase):
    password: str
    confirm_password: Optional[str] = None
    company: Optional[str] = None       # Required for recruiter
    designation: Optional[str] = None   # Designation / Title for recruiter

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(UserBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    is_active: bool
    created_at: datetime

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Profile Schemas
class RecruiterProfileCreate(BaseModel):
    company: str
    title: Optional[str] = "Recruiter"
    department: Optional[str] = "Talent Acquisition"
    phone: Optional[str] = None

class RecruiterProfileResponse(RecruiterProfileCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int

class CandidateProfileCreate(BaseModel):
    phone: Optional[str] = None
    location: Optional[str] = None
    headline: Optional[str] = None
    bio: Optional[str] = None
    portfolio_url: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None

class CandidateProfileResponse(CandidateProfileCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int

# Job Schemas
class JobCreate(BaseModel):
    title: str
    department: Optional[str] = "Engineering"
    experience_level: Optional[str] = "Mid-Level"
    location: Optional[str] = "Remote / Hybrid"
    job_type: Optional[str] = "Full-Time"
    description: str
    required_skills: Optional[List[str]] = []
    preferred_skills: Optional[List[str]] = []
    min_education: Optional[str] = "Bachelor's in Computer Science or related MCA/B.Tech"
    min_experience_years: Optional[float] = 2.0
    responsibilities: Optional[List[str]] = []

class JobUpdate(BaseModel):
    title: Optional[str] = None
    department: Optional[str] = None
    experience_level: Optional[str] = None
    location: Optional[str] = None
    job_type: Optional[str] = None
    description: Optional[str] = None
    required_skills: Optional[List[str]] = None
    preferred_skills: Optional[List[str]] = None
    min_education: Optional[str] = None
    min_experience_years: Optional[float] = None
    status: Optional[str] = None

class JobResponse(JobCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int
    recruiter_id: int
    status: str
    created_at: datetime
    applications_count: Optional[int] = 0

# Resume Schemas
class ResumeParsedData(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    education: List[Dict[str, Any]] = []
    experience: List[Dict[str, Any]] = []
    skills: List[str] = []
    projects: List[Dict[str, Any]] = []
    certifications: List[str] = []
    total_years_experience: Optional[float] = 0.0

class ResumeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    candidate_id: int
    filename: str
    file_type: str
    file_size_bytes: int
    parsed_data: Dict[str, Any]
    uploaded_at: datetime
    is_active: bool

# Match Score Schemas
class MatchScoreResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    application_id: int
    overall_score: float
    semantic_score: float
    tfidf_score: float
    skill_score: float
    experience_score: Optional[float] = 100.0
    education_score: Optional[float] = 100.0
    matched_skills: List[str] = []
    weak_skills: List[str] = []
    missing_skills: List[str] = []
    strengths: List[str] = []
    gaps: List[str] = []
    weights_used: Dict[str, float] = {}
    experience_analysis: Optional[Dict[str, Any]] = {}
    education_analysis: Optional[Dict[str, Any]] = {}
    model_version: str
    calculated_at: datetime

# Skill Gap Schema
class SkillGapResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    skill_name: str
    status: str
    importance: str
    confidence: Optional[float] = 1.0
    candidate_evidence: Optional[str] = None

# Learning Resource Schema
class LearningResourceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    skill_name: str
    title: str
    provider: str
    url: str
    resource_type: str
    difficulty: str
    description: Optional[str] = None
    estimated_hours: int

# Interview Question Schema
class InterviewQuestionCreate(BaseModel):
    question: str
    category: str
    skill_focus: Optional[str] = None
    difficulty: Optional[str] = "Medium"
    suggested_answer_points: Optional[List[str]] = []

class InterviewQuestionResponse(InterviewQuestionCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int
    application_id: Optional[int] = None
    job_id: Optional[int] = None
    is_custom: bool = False

# Application Schema
class ApplicationCreate(BaseModel):
    job_id: int
    resume_id: int

class ApplicationStatusUpdate(BaseModel):
    status: str
    recruiter_notes: Optional[str] = None
    is_shortlisted: Optional[bool] = None

class ApplicationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    job_id: int
    candidate_id: int
    resume_id: int
    status: str
    recruiter_notes: Optional[str] = None
    is_shortlisted: bool
    applied_at: datetime
    candidate_name: Optional[str] = None
    candidate_email: Optional[str] = None
    job_title: Optional[str] = None
    match_score: Optional[MatchScoreResponse] = None

# Dashboard & Analytics Schemas
class RecruiterDashboardResponse(BaseModel):
    total_jobs: int
    active_jobs: int
    total_applications: int
    candidates_screened: int
    shortlisted_candidates: int
    average_match_score: float
    recent_applications: List[ApplicationResponse]
    score_distribution: Dict[str, int]
    top_skills_in_demand: List[Dict[str, Any]]

class CandidateDashboardResponse(BaseModel):
    candidate_name: str
    resumes_count: int
    applications_count: int
    average_score: float
    recent_applications: List[ApplicationResponse]
    top_missing_skills: List[str]
    suggested_resources: List[LearningResourceResponse]

# Model Evaluation Schemas
class EvaluationMetricResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    metric_name: str
    precision: float
    recall: float
    f1_score: float
    sample_size: int
    latency_ms: float
    notes: Optional[str] = None
    evaluated_at: datetime
