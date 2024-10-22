import os
from pathlib import Path

class Config:
    BASE_DIR = Path(__file__).parent.parent
    CACHE_DIR = BASE_DIR / "cache"
    OUTPUT_DIR = BASE_DIR / "output"
    LOG_DIR = BASE_DIR / "logs"
    
    # API Keys (replace with your own)
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    
    # Scraping Configuration
    SCRAPING_DELAY = 2
    MAX_PAPERS = 100
    USER_AGENT = "Research Assistant Bot 1.0"
    
    # Research Sites
    ARXIV_URL = "https://arxiv.org"
    SCHOLAR_URL = "https://scholar.google.com"
    
    # Analysis Settings
    MIN_CITATION_COUNT = 5
    MAX_GRAPH_NODES = 50
    SIMILARITY_THRESHOLD = 0.7
