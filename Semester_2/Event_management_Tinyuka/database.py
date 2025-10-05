from uuid import uuid4

from schemas.user import User
from schemas.event import Event
from schemas.speaker import Speaker
from schemas.registration import Registration
from schemas.event_speaker import EventSpeaker

users: dict[str, User] = {}
events: dict[str, Event] = {}
speakers: dict[str, Speaker] = {}
registrations: dict[str, Registration] = {}
event_speakers: dict[str, EventSpeaker] = {}

speakers_data = [
    {"name": "Kazeem Asifat", "topic": "Using Python To Build Aircraft Console"},
    {"name": "Taylor Ortwell", "topic": "PHP & Python in Synchronicity"},
    {"name": "Nuno Maduro", "topic": "Evolution of Python for Asynchronous Actions"},
]

for data in speakers_data:
    speaker = Speaker(id=str(uuid4()), **data)
    speakers[speaker.id] = speaker