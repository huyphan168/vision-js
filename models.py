from sqlalchemy import Column, Integer, String, DateTime
from database import Base

class PeopleCount(Base):
    __tablename__ = "people_counts"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime)
    count = Column(Integer)
    image_path = Column(String)