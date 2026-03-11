from pydantic import BaseModel


class UserCreate(BaseModel):
    name: str
    phone: str
    address: str


class UserUpdate(BaseModel):
    name: str | None = None
    phone: str | None = None
    address: str | None = None


class UserResponse(BaseModel):
    user_id: int
    name: str
    phone: str
    address: str

    class Config:
        from_attributes = True
