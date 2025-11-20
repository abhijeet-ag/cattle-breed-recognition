from fastapi import APIRouter
import json
from pathlib import Path
from .models import Breed, Registration, BPASuccessResponse

bpa_router = APIRouter()
breeds_router = APIRouter()

DATA_PATH = Path("/app/data/breeds.json")

@breeds_router.get("/", response_model=list[Breed])
async def get_all_breeds():
    with open(DATA_PATH, "r") as f:
        breeds_data = json.load(f)
    return breeds_data

@bpa_router.post("/register", response_model=BPASuccessResponse)
async def mock_register_animal(registration: Registration):
    print(f"Received registration for breed: {registration.confirmedBreedId}")
    return BPASuccessResponse(
        status="success",
        registrationId=f"BPA_MOCK_{registration.id}"
    )
