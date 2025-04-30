from fastapi import APIRouter, HTTPException
from sqlmodel import select, delete
from datetime import datetime

from ..db.schema import Board, BoardBase, BoardCategory, BoardCategoryBase, Post
from ..session import SessionDep

router = APIRouter(
    prefix="/boards",
    tags=["boards"],
)


@router.post("/create/")
async def create_board(board: BoardBase, session: SessionDep):
    db_board = Board.model_validate(board)
    board_category: BoardCategory = BoardCategory(board_id=db_board.id)
    session.add(db_board)
    session.add(board_category)
    await session.commit()
    await session.refresh(db_board)
    await session.refresh(board_category)
    return {"ok": True}


@router.get("/get/by_id/{board_id}")
async def read_board(board_id: int, session: SessionDep) -> Board:
    board = await session.get(Board, board_id)
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")
    return board


@router.get("/get/all")
async def read_boards(offset: int, limit: int, session: SessionDep) -> list[Board]:
    boards = session.execute(select(Board).offset(offset).limit(limit))
    return boards


@router.patch("/update/name/by_id/{board_id}")
async def update_board_name(board_id: int, name: str, session: SessionDep):
    db_board = await session.get(Board, board_id)
    if not db_board:
        raise HTTPException(status_code=404, detail="Board not found")
    db_board.name = name
    db_board.updated_at = datetime.now()
    session.add(db_board)
    await session.commit()
    await session.refresh(db_board)
    return {"ok": True}


@router.delete("/delete/by_id/{board_id}")
async def delete_board(board_id: int, session: SessionDep):
    board = await session.get(Board, board_id)
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")
    await session.delete(board)
    await session.execute(
        delete(BoardCategory).where(BoardCategory.board_id == board_id)
    )
    await session.execute(delete(Post).where(Post.board_id == board_id))
    await session.commit()
    return {"ok": True}


@router.get("/category/create/{board_id}")
async def create_board_category(board_category: BoardCategoryBase, session: SessionDep):
    db_board_category = BoardCategory.model_validate(board_category)
    session.add(db_board_category)
    await session.commit()
    await session.refresh(db_board_category)
    return {"ok": True}


@router.get("/category/get/by_id/{category_id}")
async def read_board_category(category_id: int, session: SessionDep) -> BoardCategory:
    board_category = await session.get(BoardCategory, category_id)
    if not board_category:
        raise HTTPException(status_code=404, detail="BoardCategory not found")
    return board_category


@router.get("/category/get/by_board/{board_id}")
async def read_board_categories(
    board_id: int, session: SessionDep
) -> list[BoardCategory]:
    board_categories = await session.execute(
        select(BoardCategory).where(BoardCategory.board_id == board_id)
    )
    return board_categories


@router.patch("/category/update/by_id/{category_id}")
async def update_board_category_name(category_id: int, name: str, session: SessionDep):
    db_board_category = await session.get(BoardCategory, category_id)
    if not db_board_category:
        raise HTTPException(status_code=404, detail="BoardCategory not found")
    db_board_category.name = name
    db_board_category.updated_at = datetime.now()
    await session.add(db_board_category)
    await session.commit()
    await session.refresh(db_board_category)
    return {"ok": True}


@router.delete("/category/delete/by_id/{category_id}")
async def delete_board_category(category_id: int, name: str, session: SessionDep):
    board_category = await session.get(BoardCategory, category_id)
    if not board_category:
        raise HTTPException(status_code=404, detail="BoardCategory not found")
    await session.execute(delete(Post).where(Post.category_id == category_id))
    await session.delete(board_category)
    await session.commit()
    return {"ok": True}
