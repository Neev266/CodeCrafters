# app/schemas/user_behavior.py

from pydantic import BaseModel

class UserBehavior(BaseModel):
    user_id: int
    typing_speed: float
    backspace_rate: float
    click_rate: float
    tab_switches: int
    idle_time: float
    repeated_actions: int
    session_time: float
    emotion: str  # happy, sad, frustrated