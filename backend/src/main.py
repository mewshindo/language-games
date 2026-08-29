from typing import Annotated
from fastapi import FastAPI, status, Depends, HTTPException

from sqlalchemy import select
from sqlalchemy.orm import Session

import src.models as models
from src.database import Base, engine, get_db
from src.schemas import ResultCreate, ResultResponse, UserCreate, UserResponse

Base.metadata.create_all(bind=engine)

app = FastAPI()

results = [
    {
        "id": 1,
        "mode": 'numbers',
        "language": "ja",
        "difficulty": "1"
    }
]

@app.post(
    "/api/users",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)
def create_user(user: UserCreate, db: Annotated[Session, Depends(get_db)]):
    result = db.execute(select(models.User).where(models.User.username == user.username))
    existing_user = result.scalars().first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists"
        )

    result = db.execute(select(models.User).where(models.User.email == user.email))
    existing_email = result.scalars().first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already taken"
        )

    new_user = models.User(
        username=user.username,
        email=user.email,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

@app.get(
    "/api/users/{user_id}",
    response_model=UserResponse,
)
def get_user(user_id: int, db: Annotated[Session, Depends(get_db)]):
    user = db.execute(select(models.User).where(models.User.id == user_id)).scalars().first()
    if user:
        return user
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="User not found",
    )

@app.get(
    "/api/users/{user_id}/results",
    response_model=list[ResultResponse]
)
def get_user_results(user_id: int, db: Annotated[Session, Depends(get_db)]):
    user = db.execute(select(models.User).where(models.User.id == user_id)).scalars().first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    results = db.execute(select(models.Result).where(models.Result.user_id == user_id)).scalars().all()
    return results

@app.post(
    "/api/users/{user_id}/results",
    response_model=ResultResponse,
    status_code=status.HTTP_201_CREATED
)
def post_user_result(user_id: int, result: ResultCreate, db: Annotated[Session, Depends(get_db)]):
    user = db.execute(select(models.User).where(models.User.id == user_id)).scalars().first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    new_result = models.Result(
        user_id=result.user_id,
        score=result.score,
        game=result.game,
        language=result.language,
        difficulty=result.difficulty,
    )

    db.add(new_result)
    db.commit()
    db.refresh(new_result)


@app.get("/motd")
def get_motd():
    return "Message of the day!"