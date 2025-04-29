from datetime import datetime, timedelta
from sqlmodel import Field, SQLModel as _SQLModel
from sqlalchemy.orm import declared_attr

from ..utils import snake_case


class SQLModel(_SQLModel):
    @declared_attr
    def __tablename__(cls) -> str:
        return snake_case(cls.__name__)


class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    username: str = Field(index=True, nullable=False)
    email: str = Field(index=True, unique=True, nullable=False)
    password_hash: str = Field(nullable=False)
    created_at: datetime = Field(default_factory=datetime.now, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.now, nullable=False)


class Session(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", nullable=False)
    expires_at: datetime = Field(
        default_factory=lambda: datetime.now() + timedelta(days=30), nullable=False
    )


class Board(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    username: str = Field(index=True, nullable=False)
    post_count: int = Field(default=0, nullable=False)
    created_at: datetime = Field(default_factory=datetime.now, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.now, nullable=False)


class BoardCategory(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    name: str = Field(default="기본", index=True, nullable=False)
    board_id: int = Field(foreign_key="board.id", nullable=False)
    created_at: datetime = Field(default_factory=datetime.now, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.now, nullable=False)


class Post(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    title: str = Field(index=True, nullable=False)
    content: str = Field(nullable=False)
    board_id: int = Field(foreign_key="board.id", nullable=False)
    category_id: int = Field(foreign_key="board_category.id", nullable=False)
    user_id: int = Field(foreign_key="user.id", nullable=False)
    created_at: datetime = Field(default_factory=datetime.now, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.now, nullable=False)


class Comment(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    content: str = Field(nullable=False)
    post_id: int = Field(foreign_key="post.id", nullable=False)
    user_id: int = Field(foreign_key="user.id", nullable=False)
    created_at: datetime = Field(default_factory=datetime.now, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.now, nullable=False)
