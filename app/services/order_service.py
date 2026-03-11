from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException
from decimal import Decimal
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.order_status_history import OrderStatusHistory
from app.models.bread_product import Product
from app.models.current_stock import CurrentStock
from app.models.user import User
from app.schemas.order import OrderCreate, GuestOrderCreate, OrderStatusUpdate
from app.services.user_service import get_user_by_id, get_user_by_phone


VALID_STATUSES = {"pending", "confirmed", "out_for_delivery", "completed", "cancelled"}

STATUS_TRANSITIONS = {
    "pending": {"confirmed", "cancelled"},
    "confirmed": {"out_for_delivery", "cancelled"},
    "out_for_delivery": {"completed"},
    "completed": set(),
    "cancelled": set(),
}


def place_guest_order(db: Session, order_data: GuestOrderCreate):
    db_user = get_user_by_phone(db, order_data.phone)
    if not db_user:
        db_user = User(
            name=order_data.name,
            phone=order_data.phone,
            address=order_data.address,
        )
        db.add(db_user)
        db.flush()

    internal_order = OrderCreate(user_id=db_user.user_id, items=order_data.items)
    return place_order(db, internal_order)


def place_order(db: Session, order_data: OrderCreate):
    user = get_user_by_id(db, order_data.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not order_data.items:
        raise HTTPException(status_code=400, detail="Order must contain at least one item")

    items_to_create = []
    total_amount = Decimal("0.00")

    for item in order_data.items:
        product = db.query(Product).filter(
            Product.product_id == item.product_id,
            Product.is_active == True
        ).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found or inactive")

        if item.quantity <= 0:
            raise HTTPException(status_code=400, detail="Quantity must be positive")

        stock = db.query(CurrentStock).filter(
            CurrentStock.product_id == item.product_id
        ).first()
        if not stock or stock.quantity_available < item.quantity:
            available = stock.quantity_available if stock else 0
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for '{product.name}'. Available: {available}, Requested: {item.quantity}"
            )

        unit_price = product.base_price
        subtotal = unit_price * item.quantity
        total_amount += subtotal

        items_to_create.append({
            "product_id": item.product_id,
            "quantity": item.quantity,
            "unit_price": unit_price,
            "subtotal": subtotal,
            "stock_ref": stock,
        })

    try:
        db_order = Order(
            user_id=order_data.user_id,
            current_status="pending",
            total_amount=total_amount,
        )
        db.add(db_order)
        db.flush()

        for item_data in items_to_create:
            db_item = OrderItem(
                order_id=db_order.order_id,
                product_id=item_data["product_id"],
                quantity=item_data["quantity"],
                unit_price=item_data["unit_price"],
                subtotal=item_data["subtotal"],
            )
            db.add(db_item)
            item_data["stock_ref"].quantity_available -= item_data["quantity"]

        initial_status = OrderStatusHistory(
            order_id=db_order.order_id,
            status="pending",
            changed_by="system",
            notes="Order placed",
        )
        db.add(initial_status)

        db.commit()
        db.refresh(db_order)
        return db_order

    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create order: {str(e)}")


def cancel_order(db: Session, order_id: int, phone: str):
    db_order = (
        db.query(Order)
        .options(joinedload(Order.order_items).joinedload(OrderItem.product))
        .filter(Order.order_id == order_id)
        .first()
    )
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")

    user = get_user_by_id(db, db_order.user_id)
    if not user or user.phone != phone:
        raise HTTPException(status_code=400, detail="Phone number does not match this order")

    allowed_next = STATUS_TRANSITIONS.get(db_order.current_status, set())
    if "cancelled" not in allowed_next:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot cancel an order with status '{db_order.current_status}'"
        )

    for item in db_order.order_items:
        stock = db.query(CurrentStock).filter(CurrentStock.product_id == item.product_id).first()
        if stock:
            stock.quantity_available += item.quantity

    db_order.current_status = "cancelled"
    db.add(OrderStatusHistory(
        order_id=order_id,
        status="cancelled",
        changed_by="customer",
        notes="Cancelled by customer",
    ))

    db.commit()
    db.refresh(db_order)
    return db_order


def get_order_by_id(db: Session, order_id: int):
    return (
        db.query(Order)
        .options(joinedload(Order.order_items).joinedload(OrderItem.product))
        .filter(Order.order_id == order_id)
        .first()
    )


def get_orders_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 50):
    return (
        db.query(Order)
        .options(joinedload(Order.order_items).joinedload(OrderItem.product))
        .filter(Order.user_id == user_id)
        .order_by(Order.order_date.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_all_orders(db: Session, skip: int = 0, limit: int = 100, status: str | None = None):
    query = db.query(Order).options(joinedload(Order.order_items).joinedload(OrderItem.product))
    if status:
        query = query.filter(Order.current_status == status)
    return query.order_by(Order.order_date.desc()).offset(skip).limit(limit).all()


def update_order_status(db: Session, order_id: int, status_update: OrderStatusUpdate):
    db_order = db.query(Order).filter(Order.order_id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")

    new_status = status_update.status
    if new_status not in VALID_STATUSES:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {', '.join(VALID_STATUSES)}")

    allowed_next = STATUS_TRANSITIONS.get(db_order.current_status, set())
    if new_status not in allowed_next:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot transition from '{db_order.current_status}' to '{new_status}'. "
                   f"Allowed: {', '.join(allowed_next) if allowed_next else 'none (terminal state)'}"
        )

    db_order.current_status = new_status

    history_entry = OrderStatusHistory(
        order_id=order_id,
        status=new_status,
        changed_by=status_update.changed_by,
        notes=status_update.notes,
    )
    db.add(history_entry)
    db.commit()
    db.refresh(db_order)
    return db_order
