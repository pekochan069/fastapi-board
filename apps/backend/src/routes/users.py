from fastapi import APIRouter, HTTPException
from sqlmodel import select
from datetime import datetime

from ..db.schema import Session, User
from ..session import SessionDep

router = APIRouter(
    prefix="/users",
    tags=["users"],
)


@router.post("/create/")
async def create_user(user: User, session: SessionDep) -> User:
    await session.add(user)
    await session.commit()
    await session.refresh(user)
    return {"ok": True}


@router.get("/get/{user_id}/")
async def read_user(user_id: int, session: SessionDep) -> User:
    user = await session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/get_all_limit/")
async def read_users(
    session: SessionDep, offset: int = 0, limit: int = 100
) -> list[User]:
    users = await session.exec(select(User).offset(offset).limit(limit))
    return users


@router.patch("/update/{user_id}/")
async def update_user(user_id: int, user: User, session: SessionDep) -> User:
    db_user: User = await session.get(User, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db_user.username = user.username
    db_user.email = user.email
    db_user.password_hash = user.password_hash
    db_user.updated_at = datetime.now()
    await session.commit()
    return {"ok": True}


@router.delete("/delete/{user_id}/")
async def delete_user(user_id: int, session: SessionDep):
    user = await session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    await session.delete(user)
    sessions: list[Session] = await session.exec(
        select(Session).where(Session.user_id == user_id)
    )
    for session in sessions:
        await session.delete(session)
    await session.commit()
    return {"ok": True}
