from datetime import timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
import models as models
from database import get_db
from schemas import ResultResponse


from config import settings


router = APIRouter()
