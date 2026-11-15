from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select
from ..database import get_db
from ..models import User
from ..schemas import RegisterIn, LoginIn, UserOut
from ..security import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register")
def register(payload: RegisterIn, db: Session = Depends(get_db)):
    if db.scalar(select(User).where(User.email == payload.email)):
        raise HTTPException(409, "Email already registered")
    user = User(name=payload.name, email=payload.email, hashed_password=hash_password(payload.password))
    db.add(user); db.commit(); db.refresh(user)
    return {"access_token": create_access_token(user.id), "token_type":"bearer", "user":UserOut.model_validate(user)}

@router.post("/login")
def login(payload: LoginIn, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == payload.email))
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(401, "Incorrect email or password")
    return {"access_token": create_access_token(user.id), "token_type":"bearer", "user":UserOut.model_validate(user)}

@router.post("/refresh")
def refresh_token(user: User = Depends(get_current_user)):
    return {"access_token": create_access_token(user.id), "token_type": "bearer", "user": UserOut.model_validate(user)}

@router.get("/me", response_model=UserOut)
def me(user: User = Depends(get_current_user)):
    return user
