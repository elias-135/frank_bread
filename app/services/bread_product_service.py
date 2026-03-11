from sqlalchemy.orm import Session
from app.models.bread_product import Product
from app.schemas.bread_product import ProductCreate, ProductUpdate


def get_all_products(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Product).filter(Product.is_active == True).offset(skip).limit(limit).all()


def get_product_by_id(db: Session, product_id: int):
    return db.query(Product).filter(Product.product_id == product_id).first()


def create_product(db: Session, product: ProductCreate):
    db_product = Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


def update_product(db: Session, product_id: int, product: ProductUpdate):
    db_product = get_product_by_id(db, product_id)
    if not db_product:
        return None
    for key, value in product.model_dump(exclude_unset=True).items():
        setattr(db_product, key, value)
    db.commit()
    db.refresh(db_product)
    return db_product
