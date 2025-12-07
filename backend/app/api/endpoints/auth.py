from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.api import deps
from app.core import security
from app.schemas.all import Token

router = APIRouter()

@router.post("/login", response_model=Token)
async def login_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    conn: Any = Depends(deps.get_db_conn)
) -> Any:
    print(f"DEBUG LOGIN: Attempt for email '{form_data.username}'")
    
    # Fetch user by email
    user = await conn.fetchrow("SELECT * FROM users WHERE email = $1", form_data.username)
    
    if not user:
        print(f"DEBUG LOGIN: User '{form_data.username}' NOT FOUND in DB.")
        raise HTTPException(status_code=400, detail="Incorrect email or password")
        
    print(f"DEBUG LOGIN: User found. Role: {user['role']}. Checking password...")
    is_valid = security.verify_password(form_data.password, user['password_hash'])
    print(f"DEBUG LOGIN: Password valid? {is_valid}")
    
    if not is_valid:
        print("DEBUG LOGIN: Password verification FAILED.")
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not user['is_active']:
        print("DEBUG LOGIN: User is INACTIVE.")
        raise HTTPException(status_code=400, detail="Inactive user")
        
    print("DEBUG LOGIN: Success! Generating token.")
        
    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user['email'], expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }
