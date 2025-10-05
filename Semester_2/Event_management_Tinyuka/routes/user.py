from uuid import UUID
from fastapi import APIRouter, HTTPException

from schemas.user import UserCreate, UserUpdate, Response
from services.user import user_service

user_router = APIRouter()


@user_router.get("/all", status_code=200, response_model=Response, summary="Get all users")
def get_all_users():
    users = user_service.get_all_users()
    return Response(message="Success", data=users)


@user_router.get("/details/{user_id}", status_code=200, response_model=Response, summary="Get a user by ID")
def get_user_by_id(user_id: UUID):
    user = user_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return Response(message="Success", data=user)


@user_router.post("/create", status_code=201, response_model=Response, summary="Create a new user, a 422 http response is returned if email already exists.")
def create_user(user_data: UserCreate):
    user = user_service.create_user(user_data)
    return Response(message="User was created successfully", data=user)


@user_router.patch("/update/{user_id}", status_code=200, response_model=Response, summary="Update a user")
def update_user(user_id: UUID, user_data: UserUpdate):
    user = user_service.update_user(user_id, user_data)
    if not user:
        raise HTTPException(
            status_code=404,
            detail=f"User with id: {user_id} not found"
        )
    return Response(message="User was updated successfully", data=user)


@user_router.patch("/deactivate/{user_id}", status_code=200, summary="Deactivate a user")
def deactivate_user(user_id: UUID):
    user_new_record = user_service.deactivate_user(user_id)
    if not user_new_record:
        raise HTTPException(
            status_code=404,
            detail=f"User with id: {user_id} not found"
        )
    return Response(message="User deactivated successfully", data=user_new_record)


@user_router.delete("/delete/{user_id}", status_code=200, summary="Delete a user")
def delete_user(user_id: UUID):
    is_deleted = user_service.delete_user(user_id)
    if not is_deleted:
        raise HTTPException(
            status_code=404,
            detail=f"User with id: {user_id} not found"
        )
    return Response(message="User deleted successfully", data=None)