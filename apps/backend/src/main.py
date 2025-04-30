from fastapi import FastAPI

from .routes import users, boards


app = FastAPI()
app.include_router(users.router)
app.include_router(boards.router)


@app.get("/")
async def root():
    return {"message": "Hello, world!"}
