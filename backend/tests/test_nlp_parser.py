import pytest
from app.nlp.skill_taxonomy import extract_skills_from_text, normalize_skill, get_skill_category
from app.nlp.preprocessor import clean_text, preprocess_for_tfidf
from app.nlp.ner_extractor import extract_contact_info, parse_job_description, parse_complete_resume

def test_skill_taxonomy_extraction():
    sample_text = "Proficient in Python, Machine Learning, PyTorch, React.js, Docker, Kubernetes and SQL."
    skills = extract_skills_from_text(sample_text)
    
    assert "Python" in skills
    assert "Machine Learning" in skills
    assert "PyTorch" in skills
    assert "React" in skills
    assert "Docker" in skills
    assert "Kubernetes" in skills
    assert "SQL" in skills

def test_skill_normalization():
    assert normalize_skill("reactjs") == "React"
    assert normalize_skill("k8s") == "Kubernetes"
    assert normalize_skill("postgres") == "PostgreSQL"
    assert normalize_skill("sklearn") == "scikit-learn"

def test_preprocessor_preserves_tech_keywords():
    text = "We need C, R, Go, AWS, and REST API developers with DSA background."
    cleaned = preprocess_for_tfidf(text)
    assert "c" in cleaned.split()
    assert "r" in cleaned.split()
    assert "go" in cleaned.split()
    assert "aws" in cleaned.split()

def test_contact_info_extraction():
    text = """Arjun Sharma
    Email: arjun.sharma@example.com | Phone: +91 9876543210
    Bangalore, India"""
    contact = extract_contact_info(text)
    assert contact["email"] == "arjun.sharma@example.com"
    assert "Arjun" in contact["name"]
