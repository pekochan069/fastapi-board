from fastapi import APIRouter, HTTPException
from sqlmodel import select, delete
from datetime import datetime

from ..db.schema import Session, UserBase, User, UserUpdate
from ..session import SessionDep

router = APIRouter(
    prefix="/users",
    tags=["users"],
)


@router.post("/create")
async def create_user(user: UserBase, session: SessionDep) -> User:
    db_user = User.model_validate(user)
    session.add(db_user)
    await session.commit()
    await session.refresh(db_user)
    return {"ok": True}


@router.get("/get/by_id/{user_id}")
async def read_user(user_id: int, session: SessionDep) -> User:
    user = await session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/get/all")
async def read_users(
    session: SessionDep, offset: int = 0, limit: int = 100
) -> list[User]:
    users = await session.execute(select(User).offset(offset).limit(limit))
    return users


@router.patch("/update/by_id/{user_id}")
async def update_user(user_id: int, user: UserUpdate, session: SessionDep) -> User:
    db_user: User = await session.get(User, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    user_data = user.model_dump(exclude_unset=True)
    db_user.sqlmodel_update(user_data)
    db_user.updated_at = datetime.now()
    session.add(db_user)
    await session.commit()
    await session.refresh(db_user)
    return {"ok": True}


@router.delete("/delete/by_id/{user_id}")
async def delete_user(user_id: int, session: SessionDep):
    user = await session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    await session.delete(user)
    await session.execute(delete(Session).where(Session.user_id == user_id))
    await session.commit()
    return {"ok": True}
