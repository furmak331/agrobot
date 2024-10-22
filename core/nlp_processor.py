import openai
from typing import List, Dict
import spacy
import numpy as np
from config.config import Config

class NLPProcessor:
    def __init__(self):
        self.nlp = spacy.load("en_core_web_sm")
        openai.api_key = Config.OPENAI_API_KEY
    
    def extract_key_concepts(self, text: str) -> List[str]:
        """Extract key concepts from text using SpaCy"""
        doc = self.nlp(text)
        concepts = []
        
        for ent in doc.ents:
            if ent.label_ in ["TECH", "SCIENCE", "METHOD"]:
                concepts.append(ent.text)
                
        return list(set(concepts))
    
    async def generate_summary(self, abstract: str) -> str:
        """Generate a concise summary using GPT"""
        try:
            response = await openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a research assistant. Summarize the following abstract in 2-3 sentences."},
                    {"role": "user", "content": abstract}
                ]
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Error generating summary: {str(e)}"
    
    def calculate_similarity(self, doc1: str, doc2: str) -> float:
        """Calculate similarity between two documents"""
        vec1 = self.nlp(doc1).vector
        vec2 = self.nlp(doc2).vector
        return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))
