from sqlalchemy import Column, Integer, Numeric, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class OrderItem(Base):
    __tablename__ = "order_item"

    order_item_id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.order_id"), nullable=False)
    product_id = Column(Integer, ForeignKey("product.product_id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Numeric(10, 2), nullable=False)
    subtotal = Column(Numeric(10, 2), nullable=False)
    order = relationship("Order", back_populates="order_items")
    product = relationship("Product", back_populates="order_items")

    @property
    def product_name(self):
        return self.product.name if self.product else ""
