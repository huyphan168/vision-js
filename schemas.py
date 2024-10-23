from pydantic import BaseModel
from datetime import datetime

class PeopleCountCreate(BaseModel):
    timestamp: datetime
    count: int
    image_path: str

class PeopleCount(PeopleCountCreate):
    id: int

    class Config:
        orm_mode = True

class StatsResponse(BaseModel):
    totalToday: int
    averagePerHour: float
    timeSeriesData: list[dict]