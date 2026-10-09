export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'recruiter' | 'candidate' | 'admin';
  is_active: boolean;
  created_at: string;
}

export interface Job {
  id: number;
  recruiter_id: number;
  title: string;
  department: string;
  experience_level: string;
  location: string;
  job_type: string;
  description: string;
  required_skills: string[];
  preferred_skills: string[];
  min_education: string;
  min_experience_years: number;
  status: string;
  created_at: string;
  applications_count?: number;
}

export interface ParsedResume {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  education: Array<{ degree: string; institution: string; year: string }>;
  experience: Array<{ title: string; company: string; duration: string; description: string }>;
  skills: string[];
  projects: Array<{ title: string; description: string }>;
  certifications: string[];
  sections?: Record<string, string>;
}

export interface Resume {
  id: number;
  candidate_id: number;
  filename: string;
  file_type: string;
  file_size_bytes: number;
  parsed_data: ParsedResume;
  uploaded_at: string;
  is_active: boolean;
}

export interface MatchScore {
  id: number;
  application_id: number;
  overall_score: number;
  semantic_score: number;
  tfidf_score: number;
  skill_score: number;
  matched_skills: string[];
  weak_skills: string[];
  missing_skills: string[];
  strengths: string[];
  gaps: string[];
  weights_used: {
    semantic: number;
    tfidf: number;
    skill: number;
  };
  model_version: string;
  calculated_at: string;
}

export interface SkillGap {
  id: number;
  skill_name: string;
  category?: string;
  status: 'matched' | 'weak' | 'missing';
  importance: 'required' | 'preferred';
  candidate_evidence?: string;
}

export interface LearningResource {
  id?: number;
  skill_name: string;
  title: string;
  provider: string;
  url: string;
  resource_type: string;
  difficulty: string;
  description?: string;
  estimated_hours: number;
}

export interface InterviewQuestion {
  id?: number;
  application_id?: number;
  job_id?: number;
  question: string;
  category: 'technical' | 'behavioral' | 'skill_gap';
  skill_focus?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  suggested_answer_points: string[];
  is_custom?: boolean;
}

export interface Application {
  id: number;
  job_id: number;
  candidate_id: number;
  resume_id: number;
  status: 'applied' | 'screening' | 'shortlisted' | 'interview' | 'rejected' | 'hired';
  recruiter_notes?: string;
  is_shortlisted: boolean;
  applied_at: string;
  candidate_name?: string;
  candidate_email?: string;
  job_title?: string;
  match_score?: MatchScore;
}
