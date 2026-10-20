
from typing import Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(
    title="CitySurvival Pune API",
    description="Student-focused information about stay, food, and public transport in Pune.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
   allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://citysurvival-pune.vercel.app",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

AREAS = [
    "Shivajinagar",
    "Swargate",
    "Deccan",
    "Kothrud",
    "Karve Nagar",
    "Viman Nagar",
    "Hinjawadi",
    "Wakad",
    "Hadapsar",
    "Pune Station",
]


class FeedbackSubmission(BaseModel):
    category: Literal["Stay", "Food", "Transport"]
    area: str = Field(min_length=1, max_length=100)
    place_name: str = Field(min_length=1, max_length=150)
    details: str = Field(min_length=5, max_length=2000)
    student_name: str | None = Field(default=None, max_length=100)


# Temporary storage only. Data disappears when the backend restarts.
feedback_records: list[dict] = []


@app.get("/")
def root():
    return {
        "message": "Welcome to CitySurvival Pune API!",
        "status": "running",
    }


@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "database_connected": False,
    }


@app.get("/api/areas")
def get_areas():
    return {"areas": AREAS}


@app.get("/api/stay")
def get_stay():
    return {
        "category": "stay",
        "listings": [],
        "message": "No verified stay listings have been added yet.",
    }


@app.get("/api/food")
def get_food():
    return {
        "category": "food",
        "listings": [],
        "message": "No verified food listings have been added yet.",
    }


@app.get("/api/transport/routes")
def get_transport_routes():
    return {
        "category": "transport",
        "routes": [],
        "message": "Transport route data has not been connected yet.",
    }


@app.get("/api/feedback/status")
def feedback_status():
    return {
        "enabled": True,
        "database_connected": False,
        "storage": "temporary_memory",
        "message": "Feedback is accepted temporarily, but is not permanently stored.",
    }


@app.post("/api/feedback", status_code=201)
def submit_feedback(feedback: FeedbackSubmission):
    record = feedback.model_dump()
    feedback_records.append(record)

    return {
        "success": True,
        "message": "Feedback received by the server.",
        "submission_id": len(feedback_records),
    }
