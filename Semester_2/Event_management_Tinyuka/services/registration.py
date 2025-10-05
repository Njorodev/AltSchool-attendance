from uuid import UUID, uuid4
from fastapi import HTTPException

from database import registrations, events, users, event_speakers, speakers
from schemas.registration import Registration, CreateRegistration


class EventRegistrationService:

    @staticmethod
    def get_all_registrations():
        registration_data = {}

        for registration in registrations.values():
            event = events.get(registration.event_id)
            user = users.get(registration.user_id)

            if not event or not user:
                continue
            if registration.event_id not in registration_data:
                registration_data[registration.event_id] = {
                    "event_id": event.id,
                    "event_title": event.title,
                    "event_location": event.location,
                    "event_date": event.date,
                    "event_is_open": event.is_open,
                    "registrations": []
                }

            registration_data[registration.event_id]["registrations"].append({
                "registration_id": registration.id,
                "user_id": user.id,
                "name": user.name,
                "email": user.email,
                "user_is_active": user.is_active,
                "event_registration_date": registration.registration_date,
                "attended_event": registration.attended
            })

        return {
            "success": True,
            "message": "Data fetched successfully",
            "data": list(registration_data.values())
        }


    @staticmethod
    def create_event_registration(data: CreateRegistration):
        # Check if event is still opened
        if not EventRegistrationService.is_event_open(data.event_id):
            raise HTTPException(
                status_code=422,
                detail="The event you want to register for is closed and not accepting new registration."
            )

        # Check if user is active
        if not EventRegistrationService.is_user_active(data.user_id):
            raise HTTPException(
                status_code=422,
                detail="Event registration is only available for active users."
            )

        # Check if user has already registered for this event before.
        for registration in registrations.values():
            if registration.user_id == data.user_id and registration.event_id == data.event_id:
                raise HTTPException(
                    status_code=422,
                    detail="The user is already registered for the event."
                )

        registered_for_event = Registration(id=str(uuid4()), **data.model_dump())
        registrations[registered_for_event.id] = registered_for_event
        return registered_for_event

    @staticmethod
    def mark_attendance(registration_id: UUID):
        registration = registrations.get(str(registration_id))

        if not registration:
            raise HTTPException(status_code=404, detail=f"Event registration with id: {registration_id} does not exist.")
        registration.attended = True
        return registration

    @staticmethod
    def get_all_registrations_of_a_user(user_id: UUID):
        specific_user_registrations = []

        for registration in registrations.values():
            if registration.user_id == str(user_id):
                event = events.get(registration.event_id)
                if event:
                    specific_user_registrations.append({
                        "registration_id": registration.id,
                        "event_id": event.id,
                        "event_title": event.title,
                        "event_location": event.location,
                        "event_date": event.date,
                        "event_is_open": event.is_open,
                        "event_registration_date": registration.registration_date,
                        "attended_event": registration.attended
                    })

        return {
            "success": True,
            "message": "Data fetched successfully.",
            "data": specific_user_registrations
        }

    @staticmethod
    def list_users_who_attended_any_event():
        filtered_users = {}

        for registration in registrations.values():
            if registration.attended:
                event = events.get(registration.event_id)
                user = users.get(registration.user_id)
                speakers_of_event = event_speakers.get(registration.event_id, set())

                if not event or not user:
                    continue
                if registration.user_id not in filtered_users:
                    filtered_users[registration.user_id] = {
                        "user_id": user.id,
                        "name": user.name,
                        "email": user.email,
                        "user_is_active": user.is_active,
                        "events": []
                    }

                filtered_users[registration.user_id]["events"].append({
                    "id": event.id,
                    "title": event.title,
                    "location": event.location,
                    "date": event.date,
                    "event_is_open": event.is_open,
                    "event_registration_id": registration.id,
                    "event_registration_date": registration.registration_date,
                    "attended_event": registration.attended,
                    "event_speakers": []
                })

                for event_speaker in speakers_of_event:
                    if event_speaker in speakers:
                        # Loop through the events so we can sort the speakers for each event. Since event is a dictionary, its key will be string (id)
                        # and not indexed key like lists.
                        for event_dict in filtered_users[registration.user_id]["events"]:
                            if event_dict["id"] == event.id:
                                event_dict["event_speakers"].append(speakers[event_speaker])

        return {
            "success": True,
            "message": "Data fetched successfully.",
            "data": filtered_users
        }


    @staticmethod
    def is_event_open(event_id: str):
        event = events.get(str(event_id))

        if not event:
            raise HTTPException(status_code=404, detail=f"Event with id: {event_id} does not exist.")
        return event.is_open == True

    @staticmethod
    def is_user_active(user_id: str):
        user = users.get(str(user_id))

        if not user:
            raise HTTPException(status_code=404, detail=f"User with id: {user_id} does not exist.")
        return user.is_active == True


event_registration_service = EventRegistrationService()