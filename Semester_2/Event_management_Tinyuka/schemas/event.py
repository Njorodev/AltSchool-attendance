from datetime import datetime

from pydantic import BaseModel
from typing import Optional

class Event(BaseModel):
    id: str
    title: str
    location: str
    date: datetime
    is_open: bool = True

class CreateEvent(BaseModel):
    title: str
    location: str
    date: datetime
    is_open: bool = True

class UpdateEvent(BaseModel):
    title: Optional[str] = None
    location: Optional[str] = None
    date: Optional[datetime] = None

class Response(BaseModel):
    success: bool = True
    message: Optional[str] = None
    data: Optional[Event | list[Event]] = None