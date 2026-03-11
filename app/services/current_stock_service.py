from sqlalchemy.orm import Session
from app.models.current_stock import CurrentStock
from app.models.bread_product import Product
from app.schemas.current_stock import CurrentStockCreate, CurrentStockUpdate


def get_all_available_stock(db: Session):
    return (
        db.query(Product, CurrentStock)
        .join(CurrentStock, Product.product_id == CurrentStock.product_id)
        .filter(Product.is_active == True)
        .filter(CurrentStock.quantity_available > 0)
        .all()
    )


def get_stock_by_product_id(db: Session, product_id: int):
    return db.query(CurrentStock).filter(CurrentStock.product_id == product_id).first()


def create_stock(db: Session, stock: CurrentStockCreate):
    db_stock = CurrentStock(**stock.model_dump())
    db.add(db_stock)
    db.commit()
    db.refresh(db_stock)
    return db_stock


def update_stock(db: Session, product_id: int, stock: CurrentStockUpdate):
    db_stock = get_stock_by_product_id(db, product_id)
    if not db_stock:
        return None
    for key, value in stock.model_dump(exclude_unset=True).items():
        setattr(db_stock, key, value)
    db.commit()
    db.refresh(db_stock)
    return db_stock
