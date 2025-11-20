from pydantic import BaseModel
from typing import List

class Prediction(BaseModel):
    breedId: str
    confidence: float

class InferenceResponse(BaseModel):
    predictions: List[Prediction]

class Breed(BaseModel):
    id: str
    name: str
    localName: str
    description: str
    imageUrl: str
    managementTips: str

class Registration(BaseModel):
    id: int
    timestamp: int
    latitude: float
    longitude: float
    imageUri: str
    confirmedBreedId: str

class BPASuccessResponse(BaseModel):
    status: str
    registrationId: str
