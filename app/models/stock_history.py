from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class StockHistory(Base):
    __tablename__ = "stock_history"

    history_id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("product.product_id"), nullable=False)
    stock_date = Column(Date, nullable=False)
    quantity_added = Column(Integer, default=0)
    quantity_sold = Column(Integer, default=0)
    closing_balance = Column(Integer, nullable=False)
    notes = Column(String, nullable=True)
    recorded_at = Column(DateTime(timezone=True), server_default=func.now())

    product = relationship("Product", back_populates="stock_history")
