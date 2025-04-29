from fastapi import APIRouter, HTTPException
from sqlmodel import select
from datetime import datetime

from ..db.schema import Board, BoardCategory
from ..session import SessionDep

router = APIRouter(
    prefix="/boards",
    tags=["boards"],
)


@router.post("/create/")
async def create_board(board: Board, session: SessionDep):
    board_category: BoardCategory = BoardCategory(board_id=board.id)
    await session.add(board)
    await session.add(board_category)
    await session.commit()
    await session.refresh(board)
    return {"ok": True}


@router.get("/get/{board_id}/")
async def read_board(board_id: int, session: SessionDep) -> Board:
    board = await session.get(Board, board_id)
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")
    return board


@router.get("/get_all_limit/")
async def read_boards(
    session: SessionDep, offset: int = 0, limit: int = 100
) -> list[Board]:
    boards = session.exec(select(Board).offset(offset).limit(limit))
    return boards


@router.patch("/update/name/{board_id}/")
async def update_board_name(board_id: int, name: str, session: SessionDep):
    db_board = await session.get(Board, board_id)
    if not db_board:
        raise HTTPException(status_code=404, detail="Board not found")
    db_board.name = name
    db_board.updated_at = datetime.now()
    await session.commit()
    return {"ok": True}


@router.delete("/delete/{board_id}/")
async def delete_board(board_id: int, session: SessionDep):
    board = await session.get(Board, board_id)
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")
    await session.delete(board)
    board_categories: list[BoardCategory] = await session.exec(
        select(BoardCategory).where(BoardCategory.board_id == board_id)
    )
    for board_category in board_categories:
        await session.delete(board_category)
    await session.commit()
    return {"ok": True}


@router.get("/category/create/{board_id}/")
async def create_category(board_id: int, name: str, session: SessionDep):
    board_category = BoardCategory(board_id=board_id, name=name)
    await session.add(board_category)
    await session.commit()
    await session.refresh(board_category)
    return {"ok": True}


@router.get("/category/get/{category_id}/")
async def read_category(category_id: int, session: SessionDep) -> BoardCategory:
    board_category = await session.get(BoardCategory, category_id)
    if not board_category:
        raise HTTPException(status_code=404, detail="BoardCategory not found")
    return board_category


@router.get("/category/get_all/{board_id}/")
async def read_categories(board_id: int, session: SessionDep) -> list[BoardCategory]:
    board_categories = await session.exec(
        select(BoardCategory).where(BoardCategory.board_id == board_id)
    )
    return board_categories


@router.delete("/category/delete/{category_id}/")
async def delete_category(category_id: int, name: str, session: SessionDep):
    board_category = await session.get(BoardCategory, category_id)
    if not board_category:
        raise HTTPException(status_code=404, detail="BoardCategory not found")
    await session.delete(board_category)
    await session.commit()
    return {"ok": True}
