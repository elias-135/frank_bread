from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user import UserCreate, UserUpdate, UserResponse
from app.services import user_service

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/", response_model=UserResponse, status_code=201)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    return user_service.create_user(db, user)


@router.get("/by-phone", response_model=UserResponse)
def get_user_by_phone(phone: str, db: Session = Depends(get_db)):
    user = user_service.get_user_by_phone(db, phone)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = user_service.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: int, user: UserUpdate, db: Session = Depends(get_db)):
    updated = user_service.update_user(db, user_id, user)
    if not updated:
        raise HTTPException(status_code=404, detail="User not found")
    return updated
