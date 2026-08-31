from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, EmailStr

class UserBase(BaseModel):
    username: str = Field(min_length=3, max_length=30)
    email: EmailStr = Field(max_length=100)

    
class UserCreate(UserBase):
    password: str = Field(min_length=8)

class UserUpdate(BaseModel):
    username: str | None = Field(default=None, min_length=1, max_length=50)
    email: EmailStr | None = Field(default=None, max_length=120)
    image_file: str | None = Field(default=None, min_length=1, max_length=200)

class UserResponse(UserBase):
    model_config = ConfigDict(from_attributes=True) # so that pydantic can read from the sqlalchemy model
    id: int
    username: str


class ResultBase(BaseModel):
    mode: str
    language: str
    difficulty: int

class ResultCreate(ResultBase):
    pass


class ResultResponse(ResultBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    datetime: datetime
    user: UserResponse