import re
import string
from typing import List

TECHNICAL_WHITELIST = {
    "c", "r", "go", "ai", "ml", "dl", "nlp", "sql", "git", "aws", "gcp",
    "ci", "cd", "api", "rest", "dsa", "oop", "db", "ui", "ux", "qa"
}

STANDARD_STOPWORDS = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and",
    "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being",
    "below", "between", "both", "but", "by", "can't", "cannot", "could", "couldn't",
    "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during",
    "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't",
    "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here",
    "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i",
    "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's",
    "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself",
    "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought",
    "our", "ours", "ourselves", "out", "over", "own", "same", "shan't", "she",
    "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such",
    "than", "that", "that's", "the", "their", "theirs", "them", "themselves",
    "then", "there", "there's", "these", "they", "they'd", "they'll", "they're",
    "they've", "this", "those", "through", "to", "too", "under", "until", "up",
    "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were",
    "weren't", "what", "what's", "when", "when's", "where", "where's", "which",
    "while", "who", "who's", "whom", "why", "why's", "with", "won't", "would",
    "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours",
    "yourself", "yourselves"
}

EFFECTIVE_STOPWORDS = STANDARD_STOPWORDS - TECHNICAL_WHITELIST

def clean_text(text: str) -> str:
    if not text:
        return ""
    text = text.replace("\xa0", " ").replace("\t", " ").replace("\r", "\n")
    text = re.sub(r"\n\s*\n", "\n\n", text)
    text = re.sub(r"[ ]+", " ", text)
    return text.strip()

def preprocess_for_tfidf(text: str) -> str:
    if not text:
        return ""
    cleaned = clean_text(text).lower()
    cleaned = re.sub(r"[^\w\s\+\#\.\/\-]", " ", cleaned)
    tokens = cleaned.split()
    filtered_tokens = [
        token for token in tokens
        if (token in TECHNICAL_WHITELIST) or (token not in EFFECTIVE_STOPWORDS and len(token) > 1)
    ]
    return " ".join(filtered_tokens)

def tokenize_sentences(text: str) -> List[str]:
    if not text:
        return []
    raw_lines = re.split(r"[\n•\*\-\u2022\u25cf]+|[.!?]\s+", text)
    sentences = [line.strip() for line in raw_lines if len(line.strip()) > 3]
    return sentences
