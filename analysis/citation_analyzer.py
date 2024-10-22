import networkx as nx
from typing import List, Dict
import pandas as pd
from collections import defaultdict

class CitationAnalyzer:
    def __init__(self):
        self.graph = nx.DiGraph()
    
    def build_citation_network(self, papers: List[Dict]):
        """Build a citation network from papers"""
        # Add nodes (papers)
        for paper in papers:
            self.graph.add_node(
                paper['title'],
                authors=paper['authors'],
                year=paper['published'].year
            )
        
        # Add edges (citations)
        for paper in papers:
            for reference in paper.get('references', []):
                if reference in [p['title'] for p in papers]:
                    self.graph.add_edge(paper['title'], reference)
    
    def identify_key_papers(self) -> List[Dict]:
        """Identify key papers based on citation metrics"""
        # Calculate various centrality metrics
        pagerank = nx.pagerank(self.graph)
        in_degree = dict(self.graph.in_degree())
        betweenness = nx.betweenness_centrality(self.graph)
        
        key_papers = []
        for paper in self.graph.nodes():
            score = (
                pagerank.get(paper, 0) * 0.4 +
                in_degree.get(paper, 0) / max(in_degree.values()) * 0.4 +
                betweenness.get(paper, 0) * 0.2
            )
            
            key_papers.append({
                'title': paper,
                'importance_score': score,
                'citations': in_degree.get(paper, 0),
                'pagerank': pagerank.get(paper, 0)
            })
        
        return sorted(key_papers, key=lambda x: x['importance_score'], reverse=True)
