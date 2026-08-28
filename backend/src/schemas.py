from pydantic import BaseModel, ConfigDict, Field

class ResultBase(BaseModel):
    mode: str
    language: str
    difficulty: int

class ResultSend(ResultBase):
    pass

class ResultResponse(ResultBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    datetime: str