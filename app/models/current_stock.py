from sqlalchemy import Column, Integer, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class CurrentStock(Base):
    __tablename__ = "current_stock"

    stock_id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("product.product_id"), unique=True, nullable=False)
    quantity_available = Column(Integer, nullable=False, default=0)
    last_restocked = Column(Date, nullable=True)
    last_updated = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    product = relationship("Product", back_populates="current_stock")
