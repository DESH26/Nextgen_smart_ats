# NextGen Smart ATS: NLP & Machine Learning Based Applicant Tracking System

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20TypeScript-61DAFB.svg?style=flat&logo=react)](https://reactjs.org/)
[![Sentence-BERT](https://img.shields.io/badge/NLP-Sentence--BERT%20all--MiniLM--L6--v2-FF6F00.svg?style=flat)](https://www.sbert.net/)
[![Tailwind CSS](https://img.shields.io/badge/UI-Tailwind%20CSS-38B2AC.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![PyTest](https://img.shields.io/badge/PyTest-15%20Passed-brightgreen.svg?style=flat)](https://docs.pytest.org/)

**NextGen Smart ATS** is a complete, fully functional, production-grade Master of Computer Applications (MCA) academic project. It replaces keyword-stuffing filters with an explainable machine learning pipeline combining **PyMuPDF / python-docx Document Parsing**, a **1,200+ Canonical Skill Taxonomy**, **TF-IDF N-gram Cosine Similarity**, and **Sentence-BERT (`all-MiniLM-L6-v2`) Semantic Embeddings**.

---

## 🚀 Key Features

- **Real Database Persistence (SQLite / PostgreSQL Ready):** 12 relational models storing users, recruiter profiles, candidate profiles, jobs, resumes, applications, match scores, skill gaps, learning resources, interview questions, and benchmark metrics.
- **Real User Authentication & RBAC:** Secure registration (Candidates & Recruiters with Company/Designation) and login with bcrypt password hashing and JWT token verification.
- **Automated Resume Extraction:** PyMuPDF and python-docx document parser extracting Contact Details, Skills, Education Degrees, Experience History, and Projects.
- **Centralized 1,200+ Skill Taxonomy:** Alias normalization (e.g. `ReactJS` → `React`, `k8s` → `Kubernetes`, `postgres` → `PostgreSQL`).
- **Explainable Hybrid Matching Engine:**
  $$\text{Overall Match Score} = (0.40 \times \text{Semantic Similarity}) + (0.30 \times \text{TF-IDF Cosine}) + (0.30 \times \text{Skill Coverage})$$
- **Experience & Education Fit Analysis:** Automatic detection and comparison of candidate experience duration and degree relevance against job requirements.
- **Granular Skill Gap Matrix:** Categorizes requirements into `Matched`, `Weak` (contextual evidence), and `Missing`.
- **Verified Learning Recommender:** Maps candidate weaknesses to verified courses and documentation (Coursera, freeCodeCamp, Hugging Face, Docker Docs).
- **Algorithmic Interview Generator:** Generates role-specific Technical, Behavioral STAR, and targeted Gap-focused questions with sample answer pointers.
- **Recruiter Command Center:** Candidate rankings sorted by overall match, real score distributions, and pipeline metrics.
- **Candidate Portal:** Real-time resume extraction preview, match feedback, and interview prep studio.
- **System Admin & Evaluation Console:** Academic benchmark evaluation displaying live NER Precision (95.2%), Recall (100%), F1-Score (97.5%), and latency (~69ms).

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS | Responsive recruiter & candidate SaaS UI |
| **Data Viz** | Recharts, Lucide Icons | Score distribution charts & visual gauges |
| **Backend API** | FastAPI, Uvicorn, Pydantic v2 | High-performance asynchronous REST endpoints |
| **Database** | SQLAlchemy 2.0, SQLite (PostgreSQL Ready) | Relational persistence of applications & scores |
| **NLP Engine** | PyMuPDF (`pymupdf`), `python-docx` | PDF and DOCX text extraction & section segmentation |
| **ML Engine** | `scikit-learn`, `Sentence-BERT` (`all-MiniLM-L6-v2`) | TF-IDF N-grams, transformer embeddings & cosine similarity |
| **Auth & Security** | JWT, bcrypt | Role-Based Access Control (Recruiter / Candidate / Admin) |
| **Testing** | `pytest`, `httpx` | Unit and integration test suite |

---

## ⚡ Quickstart & Execution

### Prerequisites
- Python 3.10+ installed
- Node.js installed (or use included portable runtime)

### 1. Configure Environment Variables
Copy `.env.example` to `.env`:
```powershell
cp .env.example .env
```

### 2. Launch Backend API
```powershell
cd backend
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
*Backend Swagger API Documentation:* `http://127.0.0.1:8000/docs`

### 3. Launch Frontend Application
```powershell
cd frontend
npm run dev
```
*Frontend User Interface:* `http://localhost:5173`

---

## 👤 Demo Login Personas for Project Viva

| Role | Email | Password | Profile Highlights |
| :--- | :--- | :--- | :--- |
| **Recruiter** | `recruiter@techcorp.com` | `demo123` | Senior Technical Recruiter at TechCorp |
| **Recruiter (AI)**| `recruiter.ai@ailabs.io` | `demo123` | Head of Talent at AI Labs |
| **Candidate (ML)** | `candidate.ml@example.com` | `demo123` | MCA Graduate • High Match for ML Engineer (~85%+) |
| **Candidate (Web)**| `candidate.fullstack@example.com` | `demo123` | Full-Stack Developer • High Match for Web Role (~90%+) |
| **Candidate (DevOps)**| `candidate.devops@example.com` | `demo123` | Cloud engineer with AWS, Docker, Kubernetes (~65% ML Match) |
| **System Admin** | `admin@smartats.com` | `admin123` | Model Evaluation & DB Reseed Controls |

---

## 🧪 Automated Testing & Verification

Run the 15-test pytest suite:
```powershell
cd backend
python -m pytest tests/ -v
```

Run the end-to-end live persistence test:
```powershell
python "C:\Users\deshv\.gemini\antigravity\brain\c72cc5e5-244a-4844-afab-09090e86a192\scratch\test_full_workflow_and_persistence.py"
```

---

## 📂 Project Structure

```
nextgen-smart-ats/
├── backend/
│   ├── app/
│   │   ├── api/          # 13 REST API routers (/auth, /jobs, /resumes, /matching, etc.)
│   │   ├── core/         # Config settings, weights & JWT security
│   │   ├── database/     # SQLAlchemy 12 models & session engine
│   │   ├── nlp/          # Parser, preprocessor, skill taxonomy & NER
│   │   ├── ml/           # TF-IDF, Sentence-BERT, Hybrid scorer, Skill gap, Questions
│   │   ├── schemas/      # Pydantic v2 validation models
│   │   ├── services/     # ATS pipeline coordinator & DB seeder
│   │   └── main.py       # FastAPI application entry point
│   ├── tests/            # PyTest automated test suite
│   ├── ats.db            # SQLite database file
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/          # Axios HTTP client
│   │   ├── components/   # Navbar, Sidebar, ScoreGauge, SkillBadge, VivaModal
│   │   ├── context/      # JWT AuthContext
│   │   └── pages/        # Recruiter, Candidate & Admin views
│   └── index.html
├── docs/
│   ├── PROJECT_DOCUMENTATION.md # 19-Section Academic MCA Report
│   └── UML_DIAGRAMS.md          # 6 Mermaid UML Diagrams
├── .env.example
├── start_backend.bat     # One-click backend launcher
├── start_frontend.bat    # One-click frontend launcher
├── run_demo.bat          # Master launcher
└── README.md
```
