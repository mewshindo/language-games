from contextlib import asynccontextmanager
from fastapi.exception_handlers import (
    http_exception_handler,
)

from fastapi import FastAPI, Request
from fastapi.security import HTTPBearer
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
from pydantic_settings import BaseSettings
import os
from dotenv import load_dotenv

from passlib.context import CryptContext

import models as models
from database import Base, engine

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