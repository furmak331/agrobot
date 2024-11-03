import tensorflow as tf
import numpy as np
from PIL import Image
import io

class PestDetectionService:
    def __init__(self):
        # For demo purposes, we'll use a dictionary of pests and their treatments
        self.pest_database = {
            "aphids": {
                "description": "Small sap-sucking insects that can appear in a range of colors.",
                "treatment": [
                    "Use neem oil spray",
                    "Introduce ladybugs as natural predators",
                    "Apply insecticidal soap"
                ]
            },
            "whiteflies": {
                "description": "Tiny, white flying insects that feed on plant sap.",
                "treatment": [
                    "Use yellow sticky traps",
                    "Apply insecticidal soap",
                    "Remove affected leaves"
                ]
            },
            # Add more pests as needed
        }
        
        # Load the model (placeholder for now)
        # self.model = tf.keras.models.load_model('path_to_model')

    def preprocess_image(self, image_bytes):
        # Convert bytes to image
        image = Image.open(io.BytesIO(image_bytes))
        
        # Resize image
        image = image.resize((224, 224))
        
        # Convert to array and normalize
        image_array = tf.keras.preprocessing.image.img_to_array(image)
        image_array = image_array / 255.0
        image_array = np.expand_dims(image_array, axis=0)
        
        return image_array

    def detect_pest(self, image_bytes):
        # Preprocess the image
        processed_image = self.preprocess_image(image_bytes)
        
        # For demo purposes, return a mock result
        # In production, you would use: predictions = self.model.predict(processed_image)
        mock_prediction = {
            "pest_name": "aphids",
            "confidence": 0.85
        }
        
        # Get pest information
        pest_info = self.pest_database.get(mock_prediction["pest_name"])
        
        return {
            "pest_name": mock_prediction["pest_name"],
            "confidence": mock_prediction["confidence"],
            "description": pest_info["description"],
            "treatment": pest_info["treatment"]
        }
