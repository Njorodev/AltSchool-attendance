from uuid import UUID, uuid4

from database import speakers
from schemas.speaker import Speaker, CreateSpeaker, UpdateSpeaker


class SpeakerService:

    @staticmethod
    def get_all_speakers():
        return list(speakers.values())

    @staticmethod
    def get_speaker_by_id(speaker_id):
        speaker = speakers.get(str(speaker_id))

        if not speaker:
            return None
        return speaker

    @staticmethod
    def create_speaker(speaker_data: CreateSpeaker):
        speaker = Speaker(id=str(uuid4()), **speaker_data.model_dump())
        speakers[speaker.id] = speaker
        return speaker

    @staticmethod
    def update_speaker(speaker_id: UUID, speaker_data: UpdateSpeaker):
        speaker = speakers.get(str(speaker_id))
        if not speaker:
            return None

        speaker.name = speaker_data.name
        speaker.topic = speaker_data.topic
        return speaker

    @staticmethod
    def delete_speaker(speaker_id: UUID):
        speaker = speakers.get(str(speaker_id))
        if not speaker:
            return None

        del speakers[speaker.id]
        return True


speaker_service = SpeakerService()