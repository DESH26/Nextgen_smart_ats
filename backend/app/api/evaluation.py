from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models import EvaluationMetric
from app.ml.evaluator import model_evaluator

router = APIRouter(prefix="/evaluation", tags=["Model Evaluation"])

@router.get("/metrics")
def get_evaluation_metrics(db: Session = Depends(get_db)):
    metrics = db.query(EvaluationMetric).all()
    if not metrics:
        # Run live benchmark evaluation
        res = model_evaluator.run_full_evaluation()
        return res
    return [
        {
            "id": m.id,
            "metric_name": m.metric_name,
            "precision": m.precision,
            "recall": m.recall,
            "f1_score": m.f1_score,
            "sample_size": m.sample_size,
            "latency_ms": m.latency_ms,
            "notes": m.notes,
            "evaluated_at": m.evaluated_at
        }
        for m in metrics
    ]

@router.post("/run-benchmarks")
def trigger_benchmark_run(db: Session = Depends(get_db)):
    res = model_evaluator.run_full_evaluation()
    return res
