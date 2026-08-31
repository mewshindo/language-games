from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

import src.models as models
from src.database import get_db
from src.schemas import ResultResponse, UserCreate, UserResponse, UserUpdate

router = APIRouter()

@router.get(
    "/{user_id}",
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

@router.get(
    "/{user_id}/results",
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
