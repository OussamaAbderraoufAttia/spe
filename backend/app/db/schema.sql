-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'CITIZEN', -- CITIZEN, ADMIN, AGENT
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Incident Categories
CREATE TABLE IF NOT EXISTS incident_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    priority_weight INTEGER DEFAULT 1
);

-- Incidents Table
CREATE TABLE IF NOT EXISTS incidents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location GEOMETRY(Point, 4326),
    latitude FLOAT,
    longitude FLOAT,
    date_reported TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reporter_id INTEGER REFERENCES users(id),
    category_id INTEGER REFERENCES incident_categories(id),
    status VARCHAR(50) DEFAULT 'PENDING' -- PENDING, VERIFIED, IN_PROGRESS, COMPLETED, REJECTED
);

-- Incident Media
CREATE TABLE IF NOT EXISTS incident_media (
    id SERIAL PRIMARY KEY,
    incident_id INTEGER REFERENCES incidents(id),
    file_url VARCHAR(255) NOT NULL,
    media_type VARCHAR(50)
);

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_incidents_location ON incidents USING GIST (location);
