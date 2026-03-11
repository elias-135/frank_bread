from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    address = Column(String, nullable=False)

    orders = relationship("Order", back_populates="user")
