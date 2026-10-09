import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "NextGen Smart ATS" in data["project"]
    assert data["status"] == "Online & Operational"

def test_auth_login():
    response = client.post("/api/auth/login", json={
        "email": "recruiter@techcorp.com",
        "password": "demo123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["role"] == "recruiter"

def test_list_jobs():
    response = client.get("/api/jobs")
    assert response.status_code == 200
    jobs = response.json()
    assert isinstance(jobs, list)
    assert len(jobs) >= 3

def test_evaluation_metrics():
    response = client.get("/api/evaluation/metrics")
    assert response.status_code == 200
    data = response.json()
    assert "ner_metrics" in data or isinstance(data, list)

def test_demo_users_helper():
    response = client.get("/api/auth/demo-users")
    assert response.status_code == 200
    users = response.json()
    assert len(users) >= 5
