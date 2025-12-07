from typing import Optional, List, Any
from pydantic import BaseModel, EmailStr
from enum import Enum
from datetime import datetime

class UserRole(str, Enum):
    CITIZEN = "CITIZEN"
    ADMIN = "ADMIN"
    AGENT = "AGENT"

class IncidentState(str, Enum):
    PENDING = "PENDING"
    VERIFIED = "VERIFIED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    REJECTED = "REJECTED"

# Token
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# User
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    role: UserRole = UserRole.CITIZEN

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool

# Incident
class IncidentBase(BaseModel):
    title: str
    description: str
    latitude: float
    longitude: float
    category_id: int

class IncidentCreate(IncidentBase):
    pass

class IncidentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[IncidentState] = None

class IncidentResponse(IncidentBase):
    id: int
    status: IncidentState
    date_reported: datetime
    reporter_id: int
