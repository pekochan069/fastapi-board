from fastapi import APIRouter, HTTPException
from sqlmodel import select, and_
from datetime import datetime

from ..db.schema import Board, Post, PostCreate, PostUpdate
from ..session import SessionDep

router = APIRouter(
    prefix="/posts",
    tags=["posts"],
)


@router.post("/create")
async def create_post(post: PostCreate, session: SessionDep):
    db_post = Post.model_validate(post)
    board: Board | None = await session.get(Board, post.board_id)
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")
    board.post_count += 1
    session.add(db_post)
    await session.commit()
    await session.refresh(db_post)
    await session.refresh(board)
    return {"ok": True}


@router.get("/get/by_id/{post_id}")
async def get_post(post_id: int, session: SessionDep) -> Post:
    post = await session.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


@router.get("/get/by_board/{board_id}/all")
async def get_posts_by_board(
    board_id: int, offset: int, limit: int, session: SessionDep
):
    posts = await session.execute(
        select(Post).where(Post.board_id == board_id).offset(offset).limit(limit)
    )
    return posts


@router.get("/get/by_board/{board_id}/by_category/{category_id}")
async def get_posts_by_board_category(
    board_id: int, category_id: int, offset: int, limit: int, session: SessionDep
):
    posts = await session.execute(
        select(Post)
        .where(and_(Post.board_id == board_id, Post.category_id == category_id))
        .offset(offset)
        .limit(limit)
    )
    return posts


@router.get("/get/by_user/{user_id}/all")
async def get_posts_by_user(user_id: int, offset: int, limit: int, session: SessionDep):
    posts = await session.execute(
        select(Post).where(Post.user_id == user_id).offset(offset).limit(limit)
    )
    return posts


@router.get("/get/user/{user_id}/by_board/{board_id}")
async def get_posts_by_user_board(
    user_id: int, board_id: int, offset: int, limit: int, session: SessionDep
):
    posts = await session.execute(
        select(Post)
        .where(and_(Post.user_id == user_id, Post.board_id == board_id))
        .offset(offset)
        .limit(limit)
    )
    return posts


@router.patch("/update/by_id/{post_id}")
async def update_post(post_id: int, post: PostUpdate, session: SessionDep):
    db_post: Post | None = await session.get(Post, post_id)
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
    post_data = post.model_dump(exclude_unset=True)
    db_post.sqlmodel_update(post_data)
    db_post.updated_at = datetime.now()
    session.add(db_post)
    await session.commit()
    await session.refresh(db_post)
    return {"ok": True}


@router.delete("/delete/by_id/{post_id}")
async def delete_post(post_id: int, session: SessionDep):
    post = await session.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    await session.delete(post)
    board: Board | None = await session.get(Board, post.board_id)
    if board:
        board.post_count -= 1
        await session.add(board)
    await session.commit()
    return {"ok": True}
