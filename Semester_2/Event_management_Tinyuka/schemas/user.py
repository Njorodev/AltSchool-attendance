from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    id: str
    name: str
    email: str
    is_active: bool = True

class UserCreate(BaseModel):
    name: str
    email: str
    is_active: bool = True

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None

class Response(BaseModel):
    success: bool = True
    message: Optional[str] = None
    data: Optional[User | list[User]] = None