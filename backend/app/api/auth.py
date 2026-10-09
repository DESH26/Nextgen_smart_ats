import re
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models import User, RecruiterProfile, CandidateProfile, UserRole
from app.schemas import UserCreate, UserLogin, UserResponse, TokenResponse
from app.core.security import verify_password, get_password_hash, create_access_token, decode_access_token, oauth2_scheme

router = APIRouter(prefix="/auth", tags=["Authentication"])

EMAIL_REGEX = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication token missing")
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

def require_role(allowed_roles: list):
    def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied: requires one of roles [{', '.join(allowed_roles)}]"
            )
        return current_user
    return role_checker

@router.post("/register", response_model=TokenResponse)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    clean_email = user_in.email.strip().lower()
    
    # 1. Email format validation
    if not re.match(EMAIL_REGEX, clean_email):
        raise HTTPException(status_code=400, detail="Invalid email address format.")
        
    # 2. Password validation
    if len(user_in.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters in length.")
        
    if user_in.confirm_password and user_in.password != user_in.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match.")
        
    # 3. Duplicate email check
    existing = db.query(User).filter(User.email == clean_email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email is already registered. Please sign in.")
        
    # 4. Create User
    user = User(
        email=clean_email,
        password_hash=get_password_hash(user_in.password),
        full_name=user_in.full_name.strip(),
        role=user_in.role.lower()
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # 5. Create respective profile
    if user.role == UserRole.RECRUITER.value:
        company_name = user_in.company.strip() if user_in.company else "Enterprise Solutions"
        designation = user_in.designation.strip() if user_in.designation else "Technical Recruiter"
        profile = RecruiterProfile(user_id=user.id, company=company_name, title=designation)
        db.add(profile)
    else:
        profile = CandidateProfile(user_id=user.id, headline="Software Professional")
        db.add(profile)
    db.commit()
    
    token = create_access_token(user.id, user.role)
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )

@router.post("/login", response_model=TokenResponse)
def login(login_in: UserLogin, db: Session = Depends(get_db)):
    clean_email = login_in.email.strip().lower()
    user = db.query(User).filter(User.email == clean_email).first()
    if not user or not verify_password(login_in.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password.")
        
    token = create_access_token(user.id, user.role)
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)

@router.post("/logout")
def logout(current_user: User = Depends(get_current_user)):
    return {"message": "Successfully logged out.", "user_id": current_user.id}

@router.get("/demo-users")
def get_demo_users(db: Session = Depends(get_db)):
    """Convenient helper for Viva examiners to quickly switch accounts with 1 click."""
    users = db.query(User).all()
    return [
        {
            "id": u.id,
            "email": u.email,
            "full_name": u.full_name,
            "role": u.role,
            "hint": "Default password is 'demo123' or 'admin123'"
        }
        for u in users
    ]
