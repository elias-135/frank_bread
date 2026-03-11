from sqlalchemy import Column, Integer, String, Numeric, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Product(Base):
    __tablename__ = "product"

    product_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    base_price = Column(Numeric(10, 2), nullable=False)
    category = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    current_stock = relationship("CurrentStock", back_populates="product", uselist=False)
    stock_history = relationship("StockHistory", back_populates="product")
    order_items = relationship("OrderItem", back_populates="product")
