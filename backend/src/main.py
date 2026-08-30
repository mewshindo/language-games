from contextlib import asynccontextmanager
from typing import Annotated
from fastapi.exception_handlers import (
    http_exception_handler,
    request_validation_exception_handler
)

from fastapi import FastAPI, status, Depends, Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
from jwt import JWT
from pydantic_settings import BaseSettings
import os
from dotenv import load_dotenv

from passlib.context import CryptContext

from datetime import datetime, timedelta

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

import src.models as models
from src.database import Base, engine, get_db
from src.schemas import ResultCreate, ResultResponse, UserCreate, UserResponse

class Settings(BaseSettings):
    backend_index: str = '0'

@asynccontextmanager
async def lifespan(_app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()

settings = Settings()
app = FastAPI(lifespan=lifespan)

security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

load_dotenv()
SECRET_KEY = os.getenv('JWT_SECRET_KEY')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

@app.post(
    "/api/auth/login",
    status_code=status.HTTP_200_OK
)
async def login(username: str, password: str, db: Annotated[AsyncSession, Depends(get_db)]):
    user = await db.execute(select(models.User).where(models.User.username == user.username)).scalars().first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User with this username does not exist"
        )
    if not pwd_context.verify(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    expire = datetime.now() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    token_data = {
        "sub": str(user.id),
        "username": user.username,
        "exp": expire
    }

    token = JWT.encode(payload=token_data, key=SECRET_KEY, alg=ALGORITHM)

    return {
        "access_token": token,
        "token_type": "bearer"
    }

@app.get("/api/info")
def get_info():
    return {
        "backend_index": settings.backend_index,
    }

@app.post(
    "/api/auth/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)
async def create_user(user: UserCreate, db: Annotated[AsyncSession, Depends(get_db)]):
    result = await db.execute(select(models.User).where(models.User.username == user.username))
    existing_user = result.scalars().first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists"
        )

    result = await db.execute(select(models.User).where(models.User.email == user.email))
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
    await db.commit()
    await db.refresh(new_user)

    return new_user

@app.get(
    "/api/users/{user_id}",
    response_model=UserResponse,
)
async def get_user(user_id: int, db: Annotated[AsyncSession, Depends(get_db)]):
    user = await db.execute(select(models.User).where(models.User.id == user_id)).scalars().first()
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
async def get_user_results(user_id: int, db: Annotated[AsyncSession, Depends(get_db)]):
    user = await db.execute(select(models.User).where(models.User.id == user_id)).scalars().first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    results = await db.execute(select(models.Result).where(models.Result.user_id == user_id)).scalars().all()
    return results

@app.post(
    "/api/users/{user_id}/results",
    response_model=ResultResponse,
    status_code=status.HTTP_201_CREATED
)
async def post_user_result(user_id: int, result: ResultCreate, db: Annotated[AsyncSession, Depends(get_db)]):
    user = await db.execute(select(models.User).where(models.User.id == user_id)).scalars().first()
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
    await db.commit()
    await db.refresh(new_result)


@app.get("/motd")
def get_motd():
    return "Message of the day!"

@app.exception_handler(StarletteHTTPException)
async def general_http_exception_handler(
    request: Request,
    exception: StarletteHTTPException,
):
    if request.url.path.startswith("/api"):
        return await http_exception_handler(request, exception)
    
    return JSONResponse(
        status_code=exception.status_code,
        content={
            "detail": exception.detail
        }
    )