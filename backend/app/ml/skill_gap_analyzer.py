from typing import List, Dict, Any
from app.nlp.skill_taxonomy import normalize_skill, get_skill_category

class SkillGapAnalyzer:
    """
    Compares candidate skills against job required and preferred skills,
    classifying each skill as Matched, Weak, or Missing with context evidence.
    """
    def analyze_gaps(
        self,
        candidate_skills: List[str],
        required_skills: List[str],
        preferred_skills: List[str],
        resume_text: str = ""
    ) -> List[Dict[str, Any]]:
        cand_normalized = {normalize_skill(s) for s in candidate_skills}
        resume_lower = resume_text.lower()
        
        gap_results = []
        
        # Analyze Required Skills
        for skill in required_skills:
            norm_skill = normalize_skill(skill)
            category = get_skill_category(norm_skill)
            
            if norm_skill in cand_normalized:
                status = "matched"
                evidence = f"Candidate profile explicitly lists {norm_skill} in technical competencies."
            elif norm_skill.lower() in resume_lower:
                status = "weak"
                evidence = f"Mentioned in resume context, but lacks dedicated project or experience depth."
            else:
                status = "missing"
                evidence = f"Required skill {norm_skill} not identified in resume."
                
            gap_results.append({
                "skill_name": norm_skill,
                "category": category,
                "status": status,
                "importance": "required",
                "candidate_evidence": evidence
            })
            
        # Analyze Preferred Skills
        for skill in preferred_skills:
            norm_skill = normalize_skill(skill)
            category = get_skill_category(norm_skill)
            
            if norm_skill in cand_normalized:
                status = "matched"
                evidence = f"Bonus: Candidate possesses preferred skill {norm_skill}."
            elif norm_skill.lower() in resume_lower:
                status = "weak"
                evidence = f"Partial/contextual mention of {norm_skill}."
            else:
                status = "missing"
                evidence = f"Preferred skill {norm_skill} not found."
                
            gap_results.append({
                "skill_name": norm_skill,
                "category": category,
                "status": status,
                "importance": "preferred",
                "candidate_evidence": evidence
            })
            
        return gap_results

skill_gap_analyzer = SkillGapAnalyzer()
