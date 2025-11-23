import os
os.environ["TF_USE_LEGACY_KERAS"] = "1"

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from PIL import Image
import io
import tensorflow as tf
import tf_keras

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Model
try:
    print("⏳ Loading Server Model...")
    model = tf.keras.models.load_model("model/model.h5")
    print("✅ Server Model Loaded!")
except Exception as e:
    print(f"⚠️ Warning: Could not load model.h5. Error: {e}")
    model = None

# --- CORRECTED LABELS ---
CLASSES = [
    "Gir", 
    "Ayrshire", 
    "Brown Swiss", 
    "Holstein Friesian", 
    "Sahiwal", 
    "Tharparkar"
]

@app.get("/")
def home():
    return {"message": "Cattle Recognizer API is running"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if model is None:
        return {"class": "Server Error", "confidence": 0.0}

    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        image = image.resize((224, 224))
        img_array = np.array(image) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        predictions = model.predict(img_array)
        confidence = float(np.max(predictions))
        class_idx = np.argmax(predictions)
        
        predicted_class = CLASSES[class_idx] if class_idx < len(CLASSES) else "Unknown"

        return {
            "class": predicted_class,
            "confidence": confidence
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
