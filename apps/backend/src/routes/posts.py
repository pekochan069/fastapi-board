from fastapi import APIRouter, HTTPException
from sqlmodel import select
from datetime import datetime

from ..db.schema import Board, BoardCategory, Post, User, Comment
from ..session import SessionDep

router = APIRouter(
    prefix="/posts",
    tags=["posts"],
)


@router.post("/create/")
async def create_post(post: Post, session: SessionDep):
    board: Board = await session.get(Board, post.board_id)
    board.post_count += 1
    await session.add(post)
    await session.commit()
    await session.refresh(post)
    return {"ok": True}
