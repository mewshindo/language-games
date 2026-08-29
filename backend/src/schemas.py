from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, EmailStr

class UserBase(BaseModel):
    username: str = Field(min_length=3, max_length=30)
    email: EmailStr = Field(max_length=100)


class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    model_config = ConfigDict(from_attributes=True) # so that pydantic can read from the sqlalchemy model
    id: int
    username: str


class ResultBase(BaseModel):
    mode: str
    language: str
    difficulty: int

class ResultCreate(ResultBase):
    user_id: int #temp


class ResultResponse(ResultBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    datetime: datetime
    user: UserResponse