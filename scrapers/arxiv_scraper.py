from selenium.webdriver.common.by import By
from core.driver_manager import DriverManager
from core.logger import Logger
import arxiv
import time
from typing import List, Dict

class ArxivScraper:
    def __init__(self):
        self.logger = Logger.setup_logger("arxiv_scraper")
        self.client = arxiv.Client()
    
    async def search_papers(self, query: str, max_results: int = 50) -> List[Dict]:
        """Search for papers on ArXiv"""
        try:
            search = arxiv.Search(
                query = query,
                max_results = max_results,
                sort_by = arxiv.SortCriterion.SubmittedDate
            )
            
            papers = []
            async for result in self.client.results(search):
                paper = {
                    'title': result.title,
                    'authors': [author.name for author in result.authors],
                    'abstract': result.summary,
                    'pdf_url': result.pdf_url,
                    'published': result.published,
                    'categories': result.categories
                }
                papers.append(paper)
            
            self.logger.info(f"Found {len(papers)} papers on ArXiv")
            return papers
            
        except Exception as e:
            self.logger.error(f"Error searching ArXiv: {str(e)}")
            return []
