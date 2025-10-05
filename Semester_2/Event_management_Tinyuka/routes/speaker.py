from fastapi import APIRouter, HTTPException

from schemas.speaker import Response
from services.speaker import speaker_service

speaker_router = APIRouter()

@speaker_router.get("/list", status_code=200, response_model=Response, summary="Get all speakers")
def get_all_speakers():
    speakers = speaker_service.get_all_speakers()
    return Response(message="Success", data=speakers)