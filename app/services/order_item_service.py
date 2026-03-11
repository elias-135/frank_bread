from sqlalchemy.orm import Session
from app.models.order_item import OrderItem


def get_items_by_order(db: Session, order_id: int):
    return db.query(OrderItem).filter(OrderItem.order_id == order_id).all()
