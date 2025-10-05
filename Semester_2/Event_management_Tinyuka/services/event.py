from uuid import UUID, uuid4
from fastapi import HTTPException

from database import events, speakers, event_speakers
from schemas.event import Event, CreateEvent, UpdateEvent
from schemas.event_speaker import CreateEventSpeaker


class EventService:

    @staticmethod
    def get_all_events():
        return list(events.values())

    @staticmethod
    def get_event_by_id(event_id):
        event = events.get(str(event_id))

        if not event:
            return None
        return event

    @staticmethod
    def create_event(event_data: CreateEvent):
        event = Event(id=str(uuid4()), **event_data.model_dump())
        events[event.id] = event
        return event

    @staticmethod
    def update_event(event_id: UUID, event_data: UpdateEvent):
        event = events.get(str(event_id))
        if not event:
            return None

        event.title = event_data.title
        event.location = event_data.location
        event.date = event_data.date
        return event

    @staticmethod
    def delete_event(event_id: UUID):
        event = events.get(str(event_id))
        if not event:
            return None

        del events[event.id]
        return True

    @staticmethod
    def close_event(event_id: UUID):
        event = events.get(str(event_id))
        if not event:
            return None

        event.is_open = False
        return event

    @staticmethod
    def get_assigned_speakers_for_event(event_id: UUID):
        event = events.get(str(event_id))
        if not event:
            raise HTTPException(
                status_code=404,
                detail=f"Event with the ID: {event_id} does not exist"
            )

        speakers_of_event = event_speakers.get(str(event_id), set())

        derived_event_speakers = []
        # Get the actual speaker details using the speaker id from the one-to-many relationship (event_speakers).
        # Loop through each of the speaker IDs to get the details of the speaker itself.
        for event_speaker in speakers_of_event:
            if event_speaker in speakers:
                derived_event_speakers.append(speakers[event_speaker])

        return derived_event_speakers

    @staticmethod
    def assign_speaker_to_event(event_data: CreateEventSpeaker):
        event_id = event_data.event_id
        speaker_ids = event_data.speaker_ids

        event = events.get(str(event_id))
        if not event:
            raise HTTPException(
                status_code=404,
                detail=f"Event with the ID: {event_id} does not exist"
            )

        if str(event_id) not in event_speakers:
            event_speakers[str(event_id)] = set()

        for speaker_id in speaker_ids:
            event_speakers[str(event_id)].add(speaker_id)

        return {"event_id": event_id, "assigned_speaker_ids": list(event_speakers[str(event_id)])}


event_service = EventService()