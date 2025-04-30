import os
from typing import Literal

NODE_ENV: Literal["development", "production"] = os.getenv("NODE_ENV")
DATABASE_URL: str = os.getenv("DATABASE_URL")
