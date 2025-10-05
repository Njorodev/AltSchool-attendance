from uuid import UUID, uuid4
from fastapi import HTTPException

from database import users
from schemas.user import User, UserCreate, UserUpdate


class UserService:

    @staticmethod
    def get_user_by_id(user_id):
        user = users.get(str(user_id))
        if not user:
            return None
        return user

    @staticmethod
    def get_all_users():
        return list(users.values())

    @staticmethod
    def create_user(user_data: UserCreate):
        # Check if email already exists
        for user in users.values():
            if user.email == user_data.email:
                raise HTTPException(status_code=422, detail="A user with this email already exists.")

        new_user = User(id=str(uuid4()), **user_data.model_dump())
        users[new_user.id] = new_user
        return new_user

    @staticmethod
    def update_user(user_id: UUID, user_data: UserUpdate):
        user = users.get(str(user_id))
        if not user:
            return None

        user.name = user_data.name
        user.email = user_data.email
        return user

    @staticmethod
    def delete_user(user_id: UUID):
        user = users.get(str(user_id))
        if not user:
            return None

        del users[user.id]
        return True

    @staticmethod
    def deactivate_user(user_id: UUID):
        user = users.get(str(user_id))
        if not user:
            return None

        user.is_active = False
        return user

user_service = UserService()