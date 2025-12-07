import asyncio
import os
import asyncpg
from app.core import security
from app.api.deps import get_db_connection

# Mock form data
class MockForm:
    def __init__(self, u, p):
        self.username = u
        self.password = p

async def verify():
    print("--- Verifying DB Content ---")
    conn = await asyncpg.connect(os.getenv("DATABASE_URL"))
    user = await conn.fetchrow("SELECT * FROM users WHERE email='admin@leakcontrol.dz'")
    await conn.close()
    
    if not user:
        print("!! User NOT FOUND in DB !!")
        return

    print(f"User: {user['email']}")
    print(f"Role: {user['role']}")
    print(f"Is Active: {user['is_active']}")
    print(f"Password Hash in DB: {user['password_hash'][:20]}...")
    
    # Check if hash looks like pbkdf2
    if "pbkdf2" not in user['password_hash'] and "$" not in user['password_hash']:
        print("!! WARNING: Password hash does NOT look acceptable. It might be raw !!")
    else:
        print("Password hash format seems correct (contains $ or algo name).")

    print("\n--- Verifying Password Match ---")
    plain = "adminpassword"
    is_valid = security.verify_password(plain, user['password_hash'])
    print(f"Checking '{plain}' against hash: {is_valid}")
    
    if is_valid:
        print("SUCCESS: Password verifies correctly.")
    else:
        print("FAILURE: Password verification failed.")

if __name__ == "__main__":
    asyncio.run(verify())
