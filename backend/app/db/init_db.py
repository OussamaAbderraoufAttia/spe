import asyncio
import os
import asyncpg
from app.core.security import get_password_hash

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://leakcontrol:leakcontrol_password@db:5432/leakcontrol_db")

async def init_db():
    print("Connecting to database...")
    conn = await asyncpg.connect(DATABASE_URL)
    
    try:
        # 1. Load Schema
        print("Creating tables...")
        with open("app/db/schema.sql", "r") as f:
            schema = f.read()
            await conn.execute(schema)
        
        # 2. Add Dummy Data
        print("Seeding data...")
        
        # Incident Categories
        categories = ["Pipe Leak", "Water Cut", "Sewer Overflow", "Low Pressure", "Quality Issue"]
        for cat in categories:
            await conn.execute("""
                INSERT INTO incident_categories (name, priority_weight) 
                VALUES ($1, 1) 
                ON CONFLICT (name) DO NOTHING
            """, cat)
            
        # Users
        users = [
            ("Admin User", "admin@leakcontrol.dz", "adminpassword", "ADMIN"),
            ("Agent User", "agent@leakcontrol.dz", "agentpassword", "AGENT"),
            ("John Doe", "citizen@leakcontrol.dz", "citizenpassword", "CITIZEN")
        ]
        
        for name, email, pwd, role in users:
            print(f"Hashing password for {email}: {pwd} (len={len(pwd)})")
            hashed = get_password_hash(pwd)
            await conn.execute("""
                INSERT INTO users (full_name, email, password_hash, role)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (email) DO NOTHING
            """, name, email, hashed, role)

        # Mock Incidents (Algiers)
        # Using simple WKT for points
        reporter = await conn.fetchval("SELECT id FROM users WHERE email='citizen@leakcontrol.dz'")
        cat_leak = await conn.fetchval("SELECT id FROM incident_categories WHERE name='Pipe Leak'")
        
        if reporter and cat_leak:
            # Algiers Center
            await conn.execute("""
                INSERT INTO incidents (title, description, location, latitude, longitude, reporter_id, category_id, status)
                VALUES ($1, $2, ST_GeomFromEWKT('SRID=4326;POINT(3.0588 36.7525)'), 36.7525, 3.0588, $3, $4, 'PENDING')
            """, "Leak in Didouche Mourad", "Water springing from payment", reporter, cat_leak)
            
            # Hydra
            await conn.execute("""
                INSERT INTO incidents (title, description, location, latitude, longitude, reporter_id, category_id, status)
                VALUES ($1, $2, ST_GeomFromEWKT('SRID=4326;POINT(3.0420 36.7410)'), 36.7410, 3.0420, $3, $4, 'VERIFIED')
            """, "Burst pipe in Hydra", "Main road flooded", reporter, cat_leak)

        print("Database initialized successfully!")
        
    finally:
        await conn.close()

if __name__ == "__main__":
    asyncio.run(init_db())
