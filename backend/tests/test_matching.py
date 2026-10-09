import pytest
from app.ml.tfidf_matcher import tfidf_matcher
from app.ml.semantic_matcher import semantic_matcher
from app.ml.hybrid_scorer import hybrid_scorer

def test_tfidf_matcher_range():
    resume = "Experienced Python and Machine Learning developer with PyTorch and NLP experience."
    jd = "Hiring Python Machine Learning engineer with deep learning, PyTorch, and NLP."
    score = tfidf_matcher.calculate_similarity(resume, jd)
    assert 0.0 <= score <= 100.0
    assert score > 25.0

def test_semantic_matcher_range():
    resume = "Developed transformer models for text classification and semantic search."
    jd = "Seeking NLP specialist to build dense embedding pipelines and BERT architectures."
    score, info = semantic_matcher.calculate_similarity(resume, jd)
    assert 0.0 <= score <= 100.0
    assert score > 40.0

def test_hybrid_scorer_explainability():
    resume = "Experienced in Python, PyTorch, SQL, and Docker."
    jd = "Looking for Python, Machine Learning, PyTorch, Docker, AWS, and SQL."
    
    result = hybrid_scorer.calculate_match(
        resume_text=resume,
        jd_text=jd,
        candidate_skills=["Python", "PyTorch", "SQL", "Docker"],
        jd_required_skills=["Python", "Machine Learning", "PyTorch", "SQL", "Docker", "AWS"]
    )
    
    assert "overall_score" in result
    assert "semantic_score" in result
    assert "tfidf_score" in result
    assert "skill_score" in result
    assert "matched_skills" in result
    assert "missing_skills" in result
    assert "strengths" in result
    assert "gaps" in result
    
    assert 0.0 <= result["overall_score"] <= 100.0
    assert "Python" in result["matched_skills"]
    assert "AWS" in result["missing_skills"]
