from sqlalchemy import create_engine
from sqlmodel import Session, SQLModel

from .schema import (
    User,
    Session,
    Board,
    BoardCategory,
    Post,
    Comment,
)


sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


__all__ = [
    "User",
    "Session",
    "Board",
    "BoardCategory",
    "Post",
    "Comment",
    "engine",
    "create_db_and_tables",
]
