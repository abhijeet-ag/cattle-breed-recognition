import numpy as np
from PIL import Image
import io
import logging

logger = logging.getLogger(__name__)
model = None

def load_model():
    global model
    model = "mock_model"  # Mock model for testing
    logger.info("✅ Mock model loaded successfully.")

def predict(image_bytes):
    # Mock prediction - replace with real model later
    return [
        {"breedId": "gayr", "confidence": 0.85},
        {"breedId": "sahiwal", "confidence": 0.10},
        {"breedId": "jersey", "confidence": 0.05}
    ]
