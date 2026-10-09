from typing import Dict, Any, List, Set, Optional
from app.core.config import settings
from app.ml.tfidf_matcher import tfidf_matcher
from app.ml.semantic_matcher import semantic_matcher
from app.nlp.skill_taxonomy import extract_skills_from_text, normalize_skill

class HybridScorer:
    """
    Combines:
    1. Sentence-BERT Semantic Similarity (40%)
    2. TF-IDF Keyword Cosine Similarity (30%)
    3. Skill Coverage Ratio (30%)
    Produces explainable match scores, strengths, gap highlights, and experience/education analysis.
    """
    def __init__(self):
        self.w_semantic = settings.WEIGHT_SEMANTIC
        self.w_tfidf = settings.WEIGHT_TFIDF
        self.w_skill = settings.WEIGHT_SKILL

    def calculate_match(
        self,
        resume_text: str,
        jd_text: str,
        candidate_skills: List[str],
        jd_required_skills: List[str],
        jd_preferred_skills: List[str] = None,
        candidate_education: List[Dict[str, Any]] = None,
        candidate_exp_years: float = 2.0,
        min_exp_years: float = 2.0,
        min_education: str = "Bachelor's / MCA"
    ) -> Dict[str, Any]:
        if jd_preferred_skills is None:
            jd_preferred_skills = []
        if candidate_education is None:
            candidate_education = []
            
        # 1. TF-IDF Score (0-100)
        tfidf_score = tfidf_matcher.calculate_similarity(resume_text, jd_text)
        
        # 2. Semantic Score (0-100)
        semantic_score, model_info = semantic_matcher.calculate_similarity(resume_text, jd_text)
        
        # 3. Skill Coverage Score (0-100)
        cand_skill_set = {normalize_skill(s) for s in candidate_skills}
        req_skill_set = {normalize_skill(s) for s in jd_required_skills}
        pref_skill_set = {normalize_skill(s) for s in jd_preferred_skills}
        
        if not req_skill_set:
            extracted_jd_skills = extract_skills_from_text(jd_text)
            req_skill_set = {normalize_skill(s) for s in extracted_jd_skills}
            
        matched_required = cand_skill_set.intersection(req_skill_set)
        missing_required = req_skill_set - cand_skill_set
        matched_preferred = cand_skill_set.intersection(pref_skill_set)
        
        if req_skill_set:
            req_ratio = len(matched_required) / len(req_skill_set)
        else:
            req_ratio = 0.5
            
        pref_ratio = (len(matched_preferred) / len(pref_skill_set)) if pref_skill_set else 0.0
        skill_score = round(min(100.0, (req_ratio * 85.0) + (pref_ratio * 15.0)), 2)
        
        # Identify weak skills (partial/contextual mention in resume text)
        weak_skills = []
        resume_lower = resume_text.lower()
        for missing in list(missing_required):
            if missing.lower() in resume_lower:
                weak_skills.append(missing)
                missing_required.remove(missing)
                
        # 4. Weighted Hybrid Match Score
        overall_score = round(
            (self.w_semantic * semantic_score) +
            (self.w_tfidf * tfidf_score) +
            (self.w_skill * skill_score),
            2
        )
        
        # 5. Experience & Education Analysis
        exp_diff = candidate_exp_years - min_exp_years
        if exp_diff >= 0:
            exp_status = "Strong Fit"
            exp_score = 100.0
        elif exp_diff >= -1:
            exp_status = "Moderate Fit (Within 1 year)"
            exp_score = 80.0
        else:
            exp_status = "Junior to Stated Requirement"
            exp_score = 60.0
            
        exp_analysis = {
            "required_years": f"{min_exp_years} years",
            "candidate_years": f"{candidate_exp_years} years",
            "status": exp_status,
            "score": exp_score
        }
        
        edu_degrees = [e.get("degree", "") for e in candidate_education]
        edu_text = " ".join(edu_degrees).lower()
        if any(d in edu_text for d in ["mca", "b.tech", "m.tech", "master", "bachelor", "bca", "computer science"]):
            edu_status = "Relevant Degree Detected"
            edu_score = 100.0
        else:
            edu_status = "General Academic Qualification"
            edu_score = 85.0
            
        edu_analysis = {
            "required_education": min_education,
            "candidate_degrees": ", ".join(edu_degrees) if edu_degrees else "Graduate",
            "status": edu_status,
            "score": edu_score
        }
        
        # 6. Explainable Strengths and Gaps Highlights
        strengths = []
        gaps = []
        
        if matched_required:
            top_matched = list(matched_required)[:5]
            strengths.append(f"Strong match on core required technologies: {', '.join(top_matched)}.")
        if semantic_score >= 75.0:
            strengths.append("High contextual and architectural alignment with job responsibilities.")
        if tfidf_score >= 50.0:
            strengths.append("High keyword density across engineering domains and tools.")
        if matched_preferred:
            strengths.append(f"Possesses preferred bonus competencies: {', '.join(list(matched_preferred)[:3])}.")
        if exp_score == 100.0:
            strengths.append(f"Meets or exceeds stated experience requirement ({candidate_exp_years} yrs).")
            
        if missing_required:
            top_missing = list(missing_required)[:4]
            gaps.append(f"Missing core required skills: {', '.join(top_missing)}.")
        if weak_skills:
            gaps.append(f"Limited/contextual evidence detected for: {', '.join(weak_skills)}.")
        if skill_score < 60.0:
            gaps.append("Skill coverage is below recommended threshold for this seniority level.")
        if exp_score < 80.0:
            gaps.append(f"Candidate experience ({candidate_exp_years} yrs) is below stated requirement ({min_exp_years} yrs).")
            
        if not strengths:
            strengths.append("Foundational software engineering background detected.")
        if not gaps:
            gaps.append("No critical skill gaps identified against stated job requirements.")
            
        return {
            "overall_score": overall_score,
            "semantic_score": semantic_score,
            "tfidf_score": tfidf_score,
            "skill_score": skill_score,
            "experience_score": exp_score,
            "education_score": edu_score,
            "matched_skills": sorted(list(matched_required.union(matched_preferred))),
            "weak_skills": sorted(weak_skills),
            "missing_skills": sorted(list(missing_required)),
            "strengths": strengths,
            "gaps": gaps,
            "weights_used": {
                "semantic": self.w_semantic,
                "tfidf": self.w_tfidf,
                "skill": self.w_skill
            },
            "experience_analysis": exp_analysis,
            "education_analysis": edu_analysis,
            "model_version": model_info
        }

hybrid_scorer = HybridScorer()
