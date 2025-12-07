# LeakControl - Water Management System

## Project Structure
- **backend/**: FastAPI application (Python)
- **web/**: Next.js Dashboard (TypeScript/Tailwind)
- **mobile/**: Flutter App (Dart)

## Prerequisites
- Docker & Docker Compose
- Node.js & npm
- Flutter SDK (for mobile)

## How to Run

### 1. Database & Backend
The backend and database are containerized.

```bash
# Start Database and Backend
docker-compose up --build
```
- API will be available at: `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`
- Database: `localhost:5432`

### 2. Web Dashboard
Run the web dashboard locally.

```bash
cd web
npm install
npm run dev
```
- Dashboard available at: `http://localhost:3000`
- Login Credentials (seeded): `admin@leakcontrol.dz` / `adminpassword`

### 3. Database Seeding (First Time)
To populate the database with the provided dummy data (Algerian locations):

```bash
# Determine the container ID for the backend or run inside the container
docker-compose exec backend python app/db/init_db.py
```

## Development
- **Backend**: You can run the backend locally without Docker if you prefer, but ensure the DB is running.
  ```bash
  cd backend
  pip install -r requirements.txt
  uvicorn app.main:app --reload
  ```
