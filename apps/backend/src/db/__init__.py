from sqlalchemy.ext.asyncio import create_async_engine

from ..env import DATABASE_URL

from .schema import (
    User,
    Session,
    Board,
    BoardCategory,
    Post,
    Comment,
)


db_url = f"sqlite+aiosqlite:///{DATABASE_URL}"
connect_args = {"check_same_thread": False}
engine = create_async_engine(db_url, connect_args=connect_args)


__all__ = [
    "User",
    "Session",
    "Board",
    "BoardCategory",
    "Post",
    "Comment",
    "engine",
]
