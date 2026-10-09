import pytest
from app.ml.interview_generator import interview_generator

def test_interview_question_generation():
    questions = interview_generator.generate_questions(
        job_title="Machine Learning Engineer",
        candidate_skills=["Python", "Machine Learning"],
        missing_skills=["Docker", "AWS"],
        weak_skills=["Kubernetes"]
    )
    
    assert len(questions) > 0
    categories = [q["category"] for q in questions]
    assert "skill_gap" in categories
    assert "technical" in categories
    assert "behavioral" in categories
    
    for q in questions:
        assert "question" in q
        assert "difficulty" in q
        assert "suggested_answer_points" in q
        assert len(q["suggested_answer_points"]) > 0
