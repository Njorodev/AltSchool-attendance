from uuid import UUID
from fastapi import APIRouter, HTTPException
from services.event import event_service
from schemas.event import CreateEvent, UpdateEvent, Response
from schemas.event_speaker import CreateEventSpeaker, Response as EventSpeakerResponse

event_router = APIRouter()

@event_router.get("/list", response_model=Response, summary="Get all events")
def get_all_events():
    events = event_service.get_all_events()
    return Response(message="Success", data=events)


@event_router.get("/details/{event_id}", status_code=200, response_model=Response, summary="Get event by ID")
def get_event_by_id(event_id: UUID):
    event = event_service.get_event_by_id(event_id)
#     if not evefrom uuid import UUID
from fastapi import APIRouter, HTTPException
from services.event import event_service
from schemas.event import CreateEvent, UpdateEvent, Response
from schemas.event_speaker import CreateEventSpeaker, Response as EventSpeakerResponse

event_router = APIRouter()

@event_router.get("/list", response_model=Response, summary="Get all events")
def get_all_events():
    events = event_service.get_all_events()
    return Response(message="Success", data=events)


@event_router.get("/details/{event_id}", status_code=200, response_model=Response, summary="Get event by ID")
def get_event_by_id(event_id: UUID):
    event = event_service.get_event_by_id(event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return Response(message="Success", data=event)


@event_router.post("/create", status_code=201, response_model=Response, summary="Create a new event")
def create_event(event_data: CreateEvent):
    event = event_service.create_event(event_data)
    return Response(message="Event was created successfully", data=event)


@event_router.patch("/update/{event_id}", status_code=200, response_model=Response, summary="Update an event")
def update_event(event_id: UUID, event_data: UpdateEvent):
    event = event_service.update_event(event_id, event_data)
    if not event:
        raise HTTPException(
            status_code=404,
            detail=f"Event with id: {event_id} not found"
        )
    return Response(message="Event was updated successfully", data=event)


@event_router.patch("/close/{event_id}", status_code=200, summary="Close an event")
def deactivate_event(event_id: UUID):
    event_new_record = event_service.close_event(event_id)
    if not event_new_record:
        raise HTTPException(
            status_code=404,
            detail=f"Event with id: {event_id} not found"
        )
    return Response(message="Event closed successfully", data=event_new_record)


@event_router.delete("/delete/{event_id}", status_code=200, summary="Delete an event")
def delete_event(event_id: UUID):
    is_deleted = event_service.delete_event(event_id)
    if not is_deleted:
        raise HTTPException(
            status_code=404,
            detail=f"event with id: {event_id} not found"
        )
    return Response(message="Event has been deleted successfully", data=None)


@event_router.get("/speakers/{event_id}", status_code=200, response_model=EventSpeakerResponse, summary="Get all the speakers of an event")
def get_event_speakers(event_id: UUID):
    speakers = event_service.get_assigned_speakers_for_event(event_id)
    return EventSpeakerResponse(message="Success", data=speakers)


@event_router.post("/assign-speaker", status_code=200, summary="Assign single or multiple speakers to an event")
def assign_speaker_to_event(data: CreateEventSpeaker):
    event_speaker = event_service.assign_speaker_to_event(data)
    return {
        "success": True,
        "message": "Speaker has been successfully assigned to the event.",
        "data": event_speaker
    }
@event_router.patch("/update/{event_id}", status_code=200, response_model=Response, summary="Update an event")
def update_event(event_id: UUID, event_data: UpdateEvent):
    event = event_service.update_event(event_id, event_data)
    if not event:
        raise HTTPException(
            status_code=404,
            detail=f"Event with id: {event_id} not found"
        )
    return Response(message="Event was updated successfully", data=event)


@event_router.patch("/close/{event_id}", status_code=200, summary="Close an event")
def deactivate_event(event_id: UUID):
    event_new_record = event_service.close_event(event_id)
    if not event_new_record:
        raise HTTPException(
            status_code=404,
            detail=f"Event with id: {event_id} not found"
        )
    return Response(message="Event closed successfully", data=event_new_record)


@event_router.delete("/delete/{event_id}", status_code=200, summary="Delete an event")
def delete_event(event_id: UUID):
    is_deleted = event_service.delete_event(event_id)
    if not is_deleted:
        raise HTTPException(
            status_code=404,
            detail=f"event with id: {event_id} not found"
        )
    return Response(message="Event has been deleted successfully", data=None)


@event_router.get("/speakers/{event_id}", status_code=200, response_model=EventSpeakerResponse, summary="Get all the speakers of an event")
def get_event_speakers(event_id: UUID):
    speakers = event_service.get_assigned_speakers_for_event(event_id)
    return EventSpeakerResponse(message="Success", data=speakers)


@event_router.post("/assign-speaker", status_code=200, summary="Assign single or multiple speakers to an event")
def assign_speaker_to_event(data: CreateEventSpeaker):
    event_speaker = event_service.assign_speaker_to_event(data)
    return {
        "success": True,
        "message": "Speaker has been successfully assigned to the event.",
        "data": event_speaker
    }