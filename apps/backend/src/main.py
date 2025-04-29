from fastapi import FastAPI

from .db import create_db_and_tables
from .routes import users, boards


create_db_and_tables()
app = FastAPI()
app.include_router(users.router)
app.include_router(boards.router)


@app.get("/")
async def root():
    return {"message": "Hello, world!"}
