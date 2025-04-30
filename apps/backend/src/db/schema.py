from datetime import datetime, timedelta
from sqlmodel import Field, SQLModel


class UserBase(SQLModel):
    username: str = Field(index=True, nullable=False)
    email: str = Field(index=True, unique=True, nullable=False)
    password_hash: str = Field(nullable=False)


class UserUpdate(SQLModel):
    username: str | None = None
    email: str | None = None
    password_hash: str | None = None


class User(UserBase, table=True):
    __tablename__ = "users"
    id: int | None = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.now, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.now, nullable=False)


class Session(SQLModel, table=True):
    __tablename__ = "sessions"
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", nullable=False)
    expires_at: datetime = Field(
        default_factory=lambda: datetime.now() + timedelta(days=30), nullable=False
    )


class BoardBase(SQLModel):
    name: str = Field(index=True, nullable=False)
    post_count: int = Field(default=0, nullable=False)


class Board(BoardBase, table=True):
    __tablename__ = "boards"
    id: int = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.now, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.now, nullable=False)


class BoardCategoryBase(SQLModel):
    name: str = Field(default="기본", index=True, nullable=False)
    board_id: int = Field(foreign_key="boards.id", nullable=False)


class BoardCategory(BoardCategoryBase, table=True):
    __tablename__ = "board_categories"
    id: int = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.now, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.now, nullable=False)


class PostBase(SQLModel):
    title: str = Field(index=True, nullable=False)
    content: str = Field(nullable=False)
    category_id: int = Field(foreign_key="board_categories.id", nullable=False)


class PostCreate(PostBase):
    board_id: int = Field(foreign_key="boards.id", nullable=False)
    user_id: int = Field(foreign_key="users.id", nullable=False)


class PostUpdate(PostBase):
    title: str | None = None
    content: str | None = None
    category_id: int | None = None


class Post(PostBase, table=True):
    __tablename__ = "posts"
    id: int = Field(default=None, primary_key=True)
    board_id: int = Field(foreign_key="boards.id", nullable=False)
    user_id: int = Field(foreign_key="users.id", nullable=False)
    created_at: datetime = Field(default_factory=datetime.now, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.now, nullable=False)


class CommentBase(SQLModel):
    content: str = Field(nullable=False)
    post_id: int = Field(foreign_key="posts.id", nullable=False)
    user_id: int = Field(foreign_key="users.id", nullable=False)


class Comment(CommentBase, table=True):
    __tablename__ = "comments"
    id: int = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.now, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.now, nullable=False)
