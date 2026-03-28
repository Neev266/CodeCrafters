from pydantic import BaseModel
from typing import Optional

class N8NResponse(BaseModel):
    user_id: int
    action: Optional[str] = None
    message: Optional[str] = None
    recommendation: Optional[str] = None