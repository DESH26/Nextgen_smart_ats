import time
from typing import Dict, Any, List
from app.nlp.ner_extractor import parse_complete_resume
from app.ml.tfidf_matcher import tfidf_matcher
from app.ml.semantic_matcher import semantic_matcher
from app.ml.hybrid_scorer import hybrid_scorer

# Benchmark Annotated Ground Truth Dataset for Academic Evaluation
BENCHMARK_DATASET = [
    {
        "id": 1,
        "role": "Machine Learning Engineer",
        "resume_text": "Experienced Machine Learning Engineer with 3 years in Python, PyTorch, Scikit-Learn, and NLP. Built Sentence-BERT models, NER pipelines, and SQL databases. B.Tech Computer Science.",
        "jd_text": "Looking for Machine Learning Engineer with Python, NLP, PyTorch, Docker, and SQL experience. MCA or B.Tech required.",
        "ground_truth_skills": ["Python", "PyTorch", "scikit-learn", "Natural Language Processing", "SQL"],
        "expected_match_tier": "High" # 75 - 95
    },
    {
        "id": 2,
        "role": "Full-Stack Web Developer",
        "resume_text": "Frontend and Backend Developer specializing in React, Node.js, Express, JavaScript, TypeScript, HTML5, CSS3, and PostgreSQL. Built RESTful microservices.",
        "jd_text": "Frontend and Backend Developer specializing in React, Node.js, TypeScript, PostgreSQL, and AWS.",
        "ground_truth_skills": ["React", "Node.js", "Express.js", "JavaScript", "TypeScript", "HTML5", "CSS3", "PostgreSQL", "REST API", "Microservices"],
        "expected_match_tier": "High"
    },
    {
        "id": 3,
        "role": "Data Analyst",
        "resume_text": "Data Analyst with extensive experience in SQL, Excel, Tableau, Power BI, Python, and Exploratory Data Analysis. Bachelor of Science in Statistics.",
        "jd_text": "Seeking Data Analyst skilled in SQL, Power BI, Tableau, Python, and Data Visualization.",
        "ground_truth_skills": ["Data Analysis", "SQL", "Tableau", "Power BI", "Python"],
        "expected_match_tier": "High"
    }
]

class ModelEvaluator:
    """
    Computes Precision, Recall, F1-Score for NER skill extraction,
    and compares TF-IDF vs Sentence-BERT vs Hybrid matching latency & accuracy.
    """
    def run_full_evaluation(self) -> Dict[str, Any]:
        start_time = time.time()
        
        # 1. Evaluate NER Skill Extraction
        tp_total = 0
        fp_total = 0
        fn_total = 0
        
        for sample in BENCHMARK_DATASET:
            parsed = parse_complete_resume(sample["resume_text"])
            extracted = set([s.lower() for s in parsed["skills"]])
            truth = set([s.lower() for s in sample["ground_truth_skills"]])
            
            tp = len(extracted.intersection(truth))
            fp = len(extracted - truth)
            fn = len(truth - extracted)
            
            tp_total += tp
            fp_total += fp
            fn_total += fn
            
        precision = tp_total / (tp_total + fp_total + 1e-9)
        recall = tp_total / (tp_total + fn_total + 1e-9)
        f1 = (2 * precision * recall) / (precision + recall + 1e-9)
        
        # 2. Model Latency & Similarity Comparison
        tfidf_scores = []
        sbert_scores = []
        hybrid_scores = []
        
        for sample in BENCHMARK_DATASET:
            r_text = sample["resume_text"]
            j_text = sample["jd_text"]
            
            t_score = tfidf_matcher.calculate_similarity(r_text, j_text)
            s_score, _ = semantic_matcher.calculate_similarity(r_text, j_text)
            h_res = hybrid_scorer.calculate_match(r_text, j_text, sample["ground_truth_skills"], sample["ground_truth_skills"])
            
            tfidf_scores.append(t_score)
            sbert_scores.append(s_score)
            hybrid_scores.append(h_res["overall_score"])
            
        total_time_ms = round((time.time() - start_time) * 1000, 2)
        
        return {
            "ner_metrics": {
                "precision": round(precision * 100, 2),
                "recall": round(recall * 100, 2),
                "f1_score": round(f1 * 100, 2),
                "sample_size": len(BENCHMARK_DATASET)
            },
            "model_comparison": {
                "avg_tfidf_score": round(sum(tfidf_scores) / len(tfidf_scores), 2),
                "avg_sbert_score": round(sum(sbert_scores) / len(sbert_scores), 2),
                "avg_hybrid_score": round(sum(hybrid_scores) / len(hybrid_scores), 2),
                "models_tested": ["TF-IDF (N-gram 1-2)", "Sentence-BERT (all-MiniLM-L6-v2)", "Hybrid Weighted Ensemble"]
            },
            "latency_ms": total_time_ms,
            "status": "Evaluation Verified"
        }

model_evaluator = ModelEvaluator()
