from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import logging
from .ml_handler import load_model, predict
from .models import InferenceResponse
from .routes import bpa_router, breeds_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Cattle Breed Recognition API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    load_model()

@app.get("/")
def read_root():
    return {"message": "Welcome to the Cattle Breed Recognition API"}

@app.post("/infer", response_model=InferenceResponse)
async def infer_breed(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File provided is not an image.")
    
    try:
        image_bytes = await file.read()
        predictions = predict(image_bytes)
        return InferenceResponse(predictions=predictions)
    except Exception as e:
        logger.error(f"Inference error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to process the image: {str(e)}")

app.include_router(bpa_router, prefix="/bpa", tags=["BPA Mock"])
app.include_router(breeds_router, prefix="/breeds", tags=["Breeds"])
