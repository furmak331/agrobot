from collections import defaultdict
from typing import List, Dict
import pandas as pd
from datetime import datetime, timedelta

class TrendAnalyzer:
    def analyze_research_trends(self, papers: List[Dict]) -> Dict:
        """Analyze research trends over time"""
        trends = {
            'temporal': self._analyze_temporal_trends(papers),
            'topics': self._analyze_topic_trends(papers),
            'collaboration': self._analyze_collaboration_trends(papers)
        }
        return trends
    
    def _analyze_temporal_trends(self, papers: List[Dict]) -> Dict:
        """Analyze how research activity changes over time"""
        timeline = defaultdict(int)
        for paper in papers:
            year = paper['published'].year
            timeline[year] += 1
        
        return {
            'papers_per_year': dict(sorted(timeline.items())),
            'growth_rate': self._calculate_growth_rate(timeline)
        }
    
    def _analyze_topic_trends(self, papers: List[Dict]) -> Dict:
        """Analyze trending topics and their evolution"""
        topic_timeline = defaultdict(lambda: defaultdict(int))
        
        for paper in papers:
            year = paper['published'].year
            for category in paper['categories']:
                topic_timeline[category][year] += 1
        
        return {
            'topic_evolution': dict(topic_timeline),
            'hot_topics': self._identify_hot_topics(topic_timeline)
        }
    
    def _analyze_collaboration_trends(self, papers: List[Dict]) -> Dict:
        """Analyze collaboration patterns"""
        collaboration_data = {
            'avg_authors_per_year': self._calculate_avg_authors(papers),
            'institution_collaborations': self._analyze_institutions(papers)
        }
        return collaboration_data
