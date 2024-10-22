import networkx as nx
import plotly.graph_objects as go
from typing import Dict, List

class NetworkVisualizer:
    def create_citation_network(self, graph: nx.DiGraph) -> go.Figure:
        """Create an interactive citation network visualization"""
        # Calculate layout
        pos = nx.spring_layout(graph, k=1/pow(len(graph.nodes()), 0.3))
        
        # Create edges
        edge_x = []
        edge_y = []
        for edge in graph.edges():
            x0, y0 = pos[edge[0]]
            x1, y1 = pos[edge[1]]
            edge_x.extend([x0, x1, None])
            edge_y.extend([y0, y1, None])
        
        edge_trace = go.Scatter(
            x=edge_x, y=edge_y,
            line=dict(width=0.5, color='#888'),
            hoverinfo='none',
            mode='lines')
        
        # Create nodes
        node_x = []
        node_y = []
        for node in graph.nodes():
            x, y = pos[node]
            node_x.append(x)
            node_y.append(y)
        
        node_trace = go.Scatter(
            x=node_x, y=node_y,
            mode='markers+text',
            hoverinfo='text',
            marker=dict(
                size=10,
                color=[],
                colorscale='Viridis',
                line_width=2))
        
        # Add node attributes
        node_adjacencies = []
        node_text = []
        for node in graph.nodes():
            adjacencies = list(graph.adj[node])
            node_adjacencies.append(len(adjacencies))
            node_text.append(f'{node}<br># of connections: {len(adjacencies)}')
        
        node_trace.marker.color = node_adjacencies
        node_trace.text = node_text
        
        # Create figure
        fig = go.Figure(data=[edge_trace, node_trace],
                       layout=go.Layout(
                           showlegend=False,
                           hovermode='closest',
                           margin=dict(b=20,l=5,r=5,t=40),
                           title='Research Paper Citation Network',
                           annotations=[ dict(
                               text="Paper Citation Network",
                               showarrow=False,
                               xref="paper", yref="paper",
                               x=0.005, y=-0.002 ) ],
                           xaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
                           yaxis=dict(showgrid=False, zeroline=False, showticklabels=False))
                       )
        return fig

# Example usage
if __name__ == "__main__":
    import asyncio
    
    async def main():
        # Initialize components
        arxiv_scraper = ArxivScraper()
        nlp_processor = NLPProcessor()
        citation_analyzer = CitationAnalyzer()
        trend_analyzer = TrendAnalyzer()
        network_viz = NetworkVisualizer()
        
        # Search for papers
        papers = await arxiv_scraper.search_papers(
            query="artificial intelligence ethics",
            max_results=50
        )
        
        # Process papers
        for paper in papers:
            # Extract key concepts
            paper['key_concepts'] = nlp_processor.extract_key_concepts(paper['abstract'])
            # Generate summary
            paper['summary'] = await nlp_processor.generate_summary(paper['abstract'])
        
        # Build citation network
        citation_analyzer.build_citation_network(papers)
        key_papers = citation_analyzer.identify_key_papers()
        
        # Analyze trends
        trends = trend_analyzer.analyze_research_trends(papers)
        
        # Create visualization
        network_graph = network_viz.create_citation_network(citation_analyzer.graph)
        network_graph.write_html("citation_network.html")
        
        print("Analysis complete! Check citation_network.html for visualization.")

    asyncio.run(main())
