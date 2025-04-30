from typing import Annotated
from fastapi import Depends
from sqlalchemy import MetaData
from sqlalchemy.ext.asyncio import async_sessionmaker, AsyncSession


from .db import engine

meta = MetaData()
async_session = async_sessionmaker(engine, autoflush=False, autocommit=False)


async def get_session():
    async with engine.begin() as conn:
        await conn.run_sync(meta.create_all)

    db = async_session()
    try:
        yield db
    finally:
        await db.close()
    # with Session(engine) as session:
    #     yield session


SessionDep = Annotated[AsyncSession, Depends(get_session)]
