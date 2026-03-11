from sqlalchemy.orm import Session
from app.models.stock_history import StockHistory
from app.schemas.stock_history import StockHistoryCreate


def create_stock_history_entry(db: Session, entry: StockHistoryCreate):
    db_entry = StockHistory(**entry.model_dump())
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry


def get_history_by_product(db: Session, product_id: int):
    return (
        db.query(StockHistory)
        .filter(StockHistory.product_id == product_id)
        .order_by(StockHistory.stock_date.desc())
        .all()
    )
