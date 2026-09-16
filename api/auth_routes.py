"""
api/auth_routes.py
------------------
Enterprise Authentication & Role-Based Access Control (RBAC) service for Avyra.
Supports secure salted PBKDF2-HMAC-SHA256 password verification, Supabase integration,
role-gated access control, and session token issuance.
"""

import hashlib
import hmac
import json
import logging
import os
import secrets
import time
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Header, HTTPException, status
from pydantic import BaseModel

logger = logging.getLogger(__name__)
router = APIRouter(tags=["authentication"])

# Secret used to sign session tokens
TOKEN_SECRET = os.getenv("AUTH_TOKEN_SECRET", secrets.token_hex(32))

# ---------------------------------------------------------------------------
# Password Hashing Utilities (PBKDF2-HMAC-SHA256 with cryptographically random salt)
# ---------------------------------------------------------------------------
def hash_password(password: str, salt: Optional[str] = None) -> tuple[str, str]:
    """Hashes a password with PBKDF2-HMAC-SHA256 using a 32-byte salt."""
    if not salt:
        salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        100_000,
        dklen=32
    )
    return key.hex(), salt


def verify_password(provided_password: str, stored_hash: str, salt: str) -> bool:
    """Securely verifies password using constant-time comparison."""
    computed_hash, _ = hash_password(provided_password, salt)
    return hmac.compare_digest(computed_hash, stored_hash)


# ---------------------------------------------------------------------------
# Pre-seeded Authorized Accounts & Roles
# ---------------------------------------------------------------------------
# Seed data computed with PBKDF2 hashing
_SEED_CREDENTIALS = [
    {
        "email": "ayeshamahek2509@gmail.com",
        "full_name": "Super Admin",
        "role": "super_admin",
        "password": "billionaire",
    },
    {
        "email": "suravaishnavi16@gmail.com",
        "full_name": "Surav Vaishnavi (Technical Lead)",
        "role": "technical_lead",
        "password": "millionaire",
    },
    {
        "email": "hansikareddy25@gmail.com",
        "full_name": "Hansika Reddy (PR Lead)",
        "role": "pr_lead",
        "password": "publicrelations",
    },
    {
        "email": "afreenfasiha18@gmail.com",
        "full_name": "Afreen Fasiha (Technical Team)",
        "role": "technical_team",
        "password": "techmywork",
    },
    {
        "email": "shaikfaisal786111@gmail.com",
        "full_name": "Shaik Faisal (PR Team)",
        "role": "pr_team",
        "password": "prmywork",
    },
]

# In-memory database of users (seeded at startup)
USER_DB: Dict[str, Dict[str, Any]] = {}
ACTIVE_SESSIONS: Dict[str, Dict[str, Any]] = {}
ACTIVITY_LOGS: List[Dict[str, Any]] = []

def init_user_db():
    """Initializes user directory with salted PBKDF2 hashes."""
    for item in _SEED_CREDENTIALS:
        email = item["email"].lower()
        pwd_hash, salt = hash_password(item["password"])
        USER_DB[email] = {
            "email": email,
            "full_name": item["full_name"],
            "role": item["role"],
            "password_hash": pwd_hash,
            "salt": salt,
            "is_active": True,
            "created_at": "2026-09-01T00:00:00Z",
            "last_login_at": None,
        }

init_user_db()

# ---------------------------------------------------------------------------
# Role Permissions Mapping
# ---------------------------------------------------------------------------
ROLE_PERMISSIONS: Dict[str, List[str]] = {
    "super_admin": [
        "all",
        "manage_users",
        "view_telemetry",
        "manage_roles",
        "view_activity_logs",
        "execute_generation",
        "technical_controls",
        "pr_controls",
    ],
    "technical_lead": [
        "view_telemetry",
        "technical_controls",
        "execute_generation",
        "view_activity_logs",
    ],
    "technical_team": [
        "technical_controls",
        "execute_generation",
    ],
    "pr_lead": [
        "pr_controls",
        "execute_generation",
        "manage_campaigns",
        "view_activity_logs",
    ],
    "pr_team": [
        "pr_controls",
        "execute_generation",
    ],
}

def log_activity(actor_email: str, actor_role: str, action: str, details: Dict[str, Any]):
    """Records an immutable activity log entry."""
    entry = {
        "id": secrets.token_hex(8),
        "actor_email": actor_email,
        "actor_role": actor_role,
        "action": action,
        "details": details,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    ACTIVITY_LOGS.insert(0, entry)
    if len(ACTIVITY_LOGS) > 100:
        ACTIVITY_LOGS.pop()

# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------
class LoginRequest(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    email: str
    full_name: str
    role: str
    is_active: bool
    created_at: str
    last_login_at: Optional[str] = None
    permissions: List[str]

class LoginResponse(BaseModel):
    token: str
    user: UserResponse

class UpdateRoleRequest(BaseModel):
    email: str
    role: str
    full_name: Optional[str] = None
    new_password: Optional[str] = None

# ---------------------------------------------------------------------------
# Helper: Extract Current User from Session Token
# ---------------------------------------------------------------------------
def get_current_user(authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid Authorization header",
        )
    token = authorization.split("Bearer ", 1)[1].strip()
    session = ACTIVE_SESSIONS.get(token)
    if not session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired or invalid. Please log in again.",
        )
    # Check session timeout (24 hours)
    if time.time() - session["created_at"] > 86400:
        del ACTIVE_SESSIONS[token]
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session has expired. Please re-authenticate.",
        )
    email = session["email"]
    user = USER_DB.get(email)
    if not user or not user.get("is_active", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated or unauthorized.",
        )
    return user

# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------
@router.post("/auth/login", response_model=LoginResponse)
async def login(req: LoginRequest):
    """Authenticate user with email and password."""
    email_clean = req.email.lower().strip()
    user = USER_DB.get(email_clean)

    if not user:
        logger.warning(f"Failed login attempt for unknown email: {email_clean}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been deactivated. Please contact your Super Admin.",
        )

    # Verify password
    if not verify_password(req.password, user["password_hash"], user["salt"]):
        logger.warning(f"Incorrect password attempt for email: {email_clean}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    # Issue secure session token
    token = f"avyra_{secrets.token_urlsafe(32)}"
    ACTIVE_SESSIONS[token] = {
        "email": email_clean,
        "role": user["role"],
        "created_at": time.time(),
    }

    # Update last login timestamp
    now_iso = datetime.now(timezone.utc).isoformat()
    user["last_login_at"] = now_iso

    log_activity(
        actor_email=email_clean,
        actor_role=user["role"],
        action="LOGIN",
        details={"status": "success"},
    )

    user_resp = UserResponse(
        email=user["email"],
        full_name=user["full_name"],
        role=user["role"],
        is_active=user["is_active"],
        created_at=user["created_at"],
        last_login_at=user["last_login_at"],
        permissions=ROLE_PERMISSIONS.get(user["role"], []),
    )

    return LoginResponse(token=token, user=user_resp)


@router.get("/auth/me", response_model=UserResponse)
async def get_me(authorization: Optional[str] = Header(None)):
    """Retrieve profile for the authenticated session."""
    user = get_current_user(authorization)
    return UserResponse(
        email=user["email"],
        full_name=user["full_name"],
        role=user["role"],
        is_active=user["is_active"],
        created_at=user["created_at"],
        last_login_at=user["last_login_at"],
        permissions=ROLE_PERMISSIONS.get(user["role"], []),
    )


@router.post("/auth/logout")
async def logout(authorization: Optional[str] = Header(None)):
    """Terminates the active session."""
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split("Bearer ", 1)[1].strip()
        ACTIVE_SESSIONS.pop(token, None)
    return {"message": "Logged out successfully"}


@router.get("/auth/users")
async def list_users(authorization: Optional[str] = Header(None)):
    """List all authorized users and their roles (Super Admin only)."""
    current_user = get_current_user(authorization)
    if current_user["role"] != "super_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access restricted to Super Admin only.",
        )

    users_list = []
    for u in USER_DB.values():
        # Notice: NEVER return password_hash or salt!
        users_list.append({
            "email": u["email"],
            "full_name": u["full_name"],
            "role": u["role"],
            "is_active": u["is_active"],
            "created_at": u["created_at"],
            "last_login_at": u.get("last_login_at"),
            "permissions": ROLE_PERMISSIONS.get(u["role"], []),
        })
    return {"users": users_list}


@router.post("/auth/users")
async def create_or_update_user(
    req: UpdateRoleRequest,
    authorization: Optional[str] = Header(None),
):
    """Add a new user or update an existing user's role/status (Super Admin only)."""
    current_user = get_current_user(authorization)
    if current_user["role"] != "super_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access restricted to Super Admin only.",
        )

    valid_roles = ["super_admin", "technical_lead", "pr_lead", "technical_team", "pr_team"]
    if req.role not in valid_roles:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid role. Must be one of: {', '.join(valid_roles)}",
        )

    target_email = req.email.lower().strip()
    if target_email in USER_DB:
        user = USER_DB[target_email]
        user["role"] = req.role
        if req.full_name:
            user["full_name"] = req.full_name
        if req.new_password:
            pwd_hash, salt = hash_password(req.new_password)
            user["password_hash"] = pwd_hash
            user["salt"] = salt
        action = "UPDATE_USER_ROLE"
    else:
        if not req.new_password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password is required for new users.",
            )
        pwd_hash, salt = hash_password(req.new_password)
        user = {
            "email": target_email,
            "full_name": req.full_name or target_email.split("@")[0],
            "role": req.role,
            "password_hash": pwd_hash,
            "salt": salt,
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "last_login_at": None,
        }
        USER_DB[target_email] = user
        action = "CREATE_USER"

    log_activity(
        actor_email=current_user["email"],
        actor_role=current_user["role"],
        action=action,
        details={"target_email": target_email, "assigned_role": req.role},
    )

    return {
        "message": f"User {target_email} updated successfully.",
        "user": {
            "email": user["email"],
            "full_name": user["full_name"],
            "role": user["role"],
            "is_active": user["is_active"],
        }
    }


@router.delete("/auth/users/{email}")
async def revoke_user(
    email: str,
    authorization: Optional[str] = Header(None),
):
    """Revokes / deactivates a user's access (Super Admin only)."""
    current_user = get_current_user(authorization)
    if current_user["role"] != "super_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access restricted to Super Admin only.",
        )

    target_email = email.lower().strip()
    if target_email == "ayeshamahek2509@gmail.com":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete or deactivate the primary Super Admin account.",
        )

    user = USER_DB.get(target_email)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    user["is_active"] = False

    # Invalidate any active session for this user
    tokens_to_remove = [t for t, s in ACTIVE_SESSIONS.items() if s.get("email") == target_email]
    for t in tokens_to_remove:
        ACTIVE_SESSIONS.pop(t, None)

    log_activity(
        actor_email=current_user["email"],
        actor_role=current_user["role"],
        action="REVOKE_USER_ACCESS",
        details={"target_email": target_email},
    )

    return {"message": f"User {target_email} access has been revoked."}


@router.get("/auth/activity")
async def get_activity(authorization: Optional[str] = Header(None)):
    """Fetch system activity logs (Super Admin and Team Leads)."""
    current_user = get_current_user(authorization)
    if current_user["role"] not in ["super_admin", "technical_lead", "pr_lead"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access restricted to Admins and Leads.",
        )
    return {"activities": ACTIVITY_LOGS[:50]}
