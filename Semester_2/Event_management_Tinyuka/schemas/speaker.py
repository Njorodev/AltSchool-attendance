from pydantic import BaseModel
from typing import Optional, List

class Speaker(BaseModel):
    id: str
    name: str
    topic: str

class CreateSpeaker(BaseModel):
    name: str
    topic: str

class UpdateSpeaker(BaseModel):
    name: Optional[str] = None
    topic: Optional[str] = None

class Response(BaseModel):
    success: bool = True
    message: Optional[str] = None
    data: Optional[Speaker | list[Speaker]] = None

class SpeakerService:
    def __init__(self):
        self._speakers = []
        self._next_id = 1

    def get_all_speakers(self) -> List[Speaker]:
        return self._speakers

    def get_speaker_by_id(self, speaker_id: int) -> Optional[Speaker]:
        return next((s for s in self._speakers if s.id == speaker_id), None)

    def add_speaker(self, name: str, topic: str) -> Speaker:
        speaker = Speaker(id=self._next_id, name=name, topic=topic)
        self._speakers.append(speaker)
        self._next_id += 1
        return speaker

    def update_speaker(self, speaker_id: int, update: UpdateSpeaker) -> Optional[Speaker]:
        speaker = self.get_speaker_by_id(speaker_id)
        if speaker:
            if update.name is not None:
                speaker.name = update.name
            if update.topic is not None:
                speaker.topic = update.topic
        return speaker
