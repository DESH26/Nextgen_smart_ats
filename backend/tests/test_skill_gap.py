import pytest
from app.ml.skill_gap_analyzer import skill_gap_analyzer
from app.ml.learning_recommender import get_recommendations_for_skills

def test_skill_gap_classification():
    candidate_skills = ["Python", "SQL", "Docker"]
    required_skills = ["Python", "SQL", "Docker", "Kubernetes", "AWS"]
    preferred_skills = ["FastAPI", "Terraform"]
    resume_text = "Experienced in Python and Docker. Have basic knowledge of Kubernetes clusters."
    
    gaps = skill_gap_analyzer.analyze_gaps(
        candidate_skills=candidate_skills,
        required_skills=required_skills,
        preferred_skills=preferred_skills,
        resume_text=resume_text
    )
    
    status_map = {g["skill_name"]: g["status"] for g in gaps}
    assert status_map["Python"] == "matched"
    assert status_map["SQL"] == "matched"
    assert status_map["Docker"] == "matched"
    assert status_map["Kubernetes"] == "weak"  # Mentioned in text but not explicit skill
    assert status_map["AWS"] == "missing"

def test_learning_recommender():
    recs = get_recommendations_for_skills(["Kubernetes", "AWS", "Machine Learning"])
    assert len(recs) >= 3
    skill_names = [r["skill_name"] for r in recs]
    assert "Kubernetes" in skill_names
    assert "AWS" in skill_names
