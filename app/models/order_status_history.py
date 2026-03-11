from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class OrderStatusHistory(Base):
    __tablename__ = "order_status_history"

    history_id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.order_id"), nullable=False)
    status = Column(String, nullable=False)
    changed_by = Column(String, nullable=False)
    notes = Column(String, nullable=True)
    changed_at = Column(DateTime(timezone=True), server_default=func.now())

    order = relationship("Order", back_populates="status_history")
