from pydantic import BaseModel
from typing import Optional
from schemas.speaker import Speaker

class BaseSpeaker(BaseModel):
    event_id: str
    speaker_id: str

class EventSpeaker(BaseModel):
    event_id: str
    speakers: list[Speaker]

class CreateEventSpeaker(BaseModel):
    event_id: str
    speaker_ids: list[str]

class Response(BaseModel):
    success: bool = True
    message: Optional[str] = None
    data: Optional[list[Speaker]] = None