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

from routers import results, users

class Settings(BaseSettings):
    backend_index: str = '0'

load_dotenv()
SECRET_KEY = os.getenv('JWT_SECRET_KEY')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

@asynccontextmanager
async def lifespan(_app: FastAPI):
    async with engine.begin() as conn:
        if os.getenv('BACKEND_INDEX') == "0":
            await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()

settings = Settings()
app = FastAPI(lifespan=lifespan)

app.include_router(users.router, prefix="/api/users", tags=["users"])
# app.include_router(results.router, prefix="/api/results", tags=["results"])

security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")



@app.get("/api/info")
def get_info():
    return {
        "backend_index": settings.backend_index,
    }



@app.post(
    "/api/users/{user_id}/results",
    response_model=ResultResponse,
    status_code=status.HTTP_201_CREATED
)
async def post_user_result(user_id: int, result: ResultCreate, db: Annotated[AsyncSession, Depends(get_db)]):
    userQuery = await db.execute(select(models.User).where(models.User.id == user_id))
    user = userQuery.scalars().first()
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