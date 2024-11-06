import requests
from PIL import Image
import io
from typing import Dict
import os
from dotenv import load_dotenv
import time

# Load environment variables
load_dotenv()

class PestDetectionService:
    def __init__(self):
        # Get API key from environment variable
        api_key = os.getenv('HUGGING_FACE_API_KEY')
        if not api_key:
            raise ValueError("HUGGING_FACE_API_KEY not found in environment variables")
            
        self.api_url = "https://api-inference.huggingface.co/models/nielsr/convnext-tiny-224-plant-disease"
        self.headers = {"Authorization": f"Bearer {api_key}"}
        
        self.pest_database = {
            "healthy": {
                "description": "No pests or diseases detected. Plant appears healthy.",
                "treatment": [
                    "Continue regular maintenance",
                    "Monitor for any changes",
                    "Maintain good garden hygiene"
                ]
            },
            "bacterial_leaf_blight": {
                "description": "Bacterial infection causing water-soaked lesions that turn yellow to white.",
                "treatment": [
                    "Remove infected plants",
                    "Improve air circulation",
                    "Use copper-based bactericides",
                    "Avoid overhead irrigation"
                ]
            },
            "leaf_spot": {
                "description": "Fungal disease causing circular spots on leaves.",
                "treatment": [
                    "Remove infected leaves",
                    "Improve air circulation",
                    "Apply fungicide if necessary",
                    "Avoid wetting leaves when watering"
                ]
            },
            "rust": {
                "description": "Fungal disease causing rusty spots on leaves.",
                "treatment": [
                    "Remove infected plant parts",
                    "Apply appropriate fungicide",
                    "Improve air circulation",
                    "Avoid overhead watering"
                ]
            }
        }

    def preprocess_image(self, image_bytes):
        try:
            # Open and convert image to RGB
            image = Image.open(io.BytesIO(image_bytes))
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Resize image
            image = image.resize((224, 224))
            
            # Save to bytes
            img_byte_arr = io.BytesIO()
            image.save(img_byte_arr, format='PNG')
            img_byte_arr.seek(0)
            return img_byte_arr.getvalue()
            
        except Exception as e:
            print(f"Preprocessing error: {str(e)}")
            raise ValueError(f"Error processing image: {str(e)}")

    def query_model(self, image_bytes):
        try:
            response = requests.post(
                self.api_url,
                headers=self.headers,
                data=image_bytes,
                timeout=30
            )
            
            # Print response for debugging
            print(f"Response status: {response.status_code}")
            print(f"Response content: {response.content}")
            
            if response.status_code == 503:
                print("Model is loading, waiting...")
                time.sleep(20)
                return self.query_model(image_bytes)
            
            response.raise_for_status()
            return response.json()
            
        except Exception as e:
            print(f"Query error: {str(e)}")
            raise ValueError(f"Failed to get prediction: {str(e)}")

    async def detect_pest(self, image_bytes) -> Dict:
        try:
            # Preprocess the image
            processed_image = self.preprocess_image(image_bytes)
            
            # Get prediction from model
            result = self.query_model(processed_image)
            
            print(f"Model result: {result}")  # Debug print
            
            if not result or not isinstance(result, list):
                raise ValueError("Invalid response from model")

            # Get the top prediction
            prediction = result[0]
            predicted_class = prediction.get('label', '').lower()
            confidence = prediction.get('score', 0.0)

            # Map the prediction to our pest database
            pest_info = self.pest_database.get(predicted_class, {
                "description": "Unrecognized condition. Please consult an expert.",
                "treatment": [
                    "Document the symptoms",
                    "Take multiple clear photos",
                    "Consult a local agricultural expert",
                    "Consider sending samples for laboratory analysis"
                ]
            })

            return {
                "pest_name": predicted_class.replace('_', ' ').title(),
                "confidence": round(confidence * 100, 2),
                "description": pest_info["description"],
                "treatment": pest_info["treatment"]
            }

        except Exception as e:
            print(f"Detection error: {str(e)}")
            raise ValueError(f"Error in pest detection: {str(e)}")