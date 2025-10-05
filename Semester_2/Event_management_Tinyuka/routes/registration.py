from uuid import UUID
from fastapi import APIRouter, HTTPException

from schemas.registration import CreateRegistration, Response
from services.registration import EventRegistrationService

event_registration_service = EventRegistrationService()
registration_router = APIRouter()


@registration_router.get("/", status_code=200, summary="View all registrations")
def get_all_registrations():
    return event_registration_service.get_all_registrations()


post_summary = "Register a user for an event (open events only) - Only active users can register and user cannot register twice"
@registration_router.post("/", status_code=201, summary=post_summary)
def register_for_event(data: CreateRegistration):
    registered = event_registration_service.create_event_registration(data)
    return Response(message="Congratulations! You have successfully registered for the event", data=registered)


@registration_router.patch("/mark-attendance/{registration_id}", status_code=200, summary="Mark attendance that a user attended an event")
def mark_attendance_for_event(registration_id: UUID):
    attendance_marked = event_registration_service.mark_attendance(registration_id)
    if not attendance_marked:
        raise HTTPException(
            status_code=404,
            detail=f"Event Registration with id: {registration_id} not found"
        )
    return Response(message="Attendance has been marked successfully", data=attendance_marked)


@registration_router.get("/user/{user_id}", status_code=200, summary="View registrations for a specific user")
def view_a_user_registration(user_id: UUID):
    return event_registration_service.get_all_registrations_of_a_user(user_id)


@registration_router.get("/users/attend-any", status_code=200, summary="Filter users who attended at least one event. An entire object about the user, registration, event and event speakers is returned")
def list_users_who_attended_any_event():
    return event_registration_service.list_users_who_attended_any_event()