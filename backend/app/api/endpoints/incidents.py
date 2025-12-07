from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException
from app.api import deps
from app.schemas.all import IncidentCreate, IncidentResponse, IncidentUpdate
from geoalchemy2 import WKTElement

router = APIRouter()

@router.get("/", response_model=List[IncidentResponse])
async def read_incidents(
    skip: int = 0,
    limit: int = 100,
    conn: Any = Depends(deps.get_db_conn),
) -> Any:
    # Admin/Agent see all, Citizen see theirs or all? 
    # Spec says citizen sees map, so likely all verified? 
    # For now return all for map.
    # We need to manually construct the response because our schema expects 'latitude', 'longitude' etc
    rows = await conn.fetch("""
        SELECT id, title, description, latitude, longitude, date_reported, reporter_id, category_id, status 
        FROM incidents 
        OFFSET $1 LIMIT $2
    """, skip, limit)
    
    # Convert Record objects to dictionaries
    result = [dict(row) for row in rows]
    return result

@router.post("/", response_model=IncidentResponse)
async def create_incident(
    incident: IncidentCreate,
    conn: Any = Depends(deps.get_db_conn),
    current_user: Any = Depends(deps.get_current_user),
) -> Any:
    # Use PostGIS function ST_GeomFromEWKT to create the point
    query = """
        INSERT INTO incidents (title, description, location, latitude, longitude, reporter_id, category_id, status)
        VALUES ($1, $2, ST_GeomFromEWKT($3), $4, $5, $6, $7, 'PENDING')
        RETURNING id, title, description, latitude, longitude, date_reported, reporter_id, category_id, status
    """
    wkt_location = f"SRID=4326;POINT({incident.longitude} {incident.latitude})"
    
    row = await conn.fetchrow(
        query,
        incident.title,
        incident.description,
        wkt_location,
        incident.latitude,
        incident.longitude,
        current_user['id'],
        incident.category_id
    )
    return dict(row)
