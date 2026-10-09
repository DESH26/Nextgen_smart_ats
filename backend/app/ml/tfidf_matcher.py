import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from app.nlp.preprocessor import preprocess_for_tfidf

class TfidfMatcher:
    """
    Computes keyword-based Cosine Similarity between Resume and Job Description
    using N-gram (1, 2) TF-IDF representations.
    """
    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            ngram_range=(1, 2),
            sublinear_tf=True,
            max_features=2500
        )

    def calculate_similarity(self, resume_text: str, jd_text: str) -> float:
        """
        Calculates normalized cosine similarity percentage (0.0 to 100.0).
        """
        cleaned_resume = preprocess_for_tfidf(resume_text)
        cleaned_jd = preprocess_for_tfidf(jd_text)
        
        if not cleaned_resume or not cleaned_jd:
            return 0.0
            
        try:
            tfidf_matrix = self.vectorizer.fit_transform([cleaned_resume, cleaned_jd])
            sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            # Convert to float and scale to 0-100%
            score = float(np.clip(sim * 100.0, 0.0, 100.0))
            return round(score, 2)
        except Exception:
            return 0.0

tfidf_matcher = TfidfMatcher()
