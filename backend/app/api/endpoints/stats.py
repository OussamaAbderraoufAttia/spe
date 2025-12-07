from typing import Any
from fastapi import APIRouter, Depends
from app.api import deps

router = APIRouter()

@router.get("/")
async def get_dashboard_stats(
    conn: Any = Depends(deps.get_db_conn),
) -> Any:
    total_reports = await conn.fetchval("SELECT COUNT(*) FROM incidents")
    completed = await conn.fetchval("SELECT COUNT(*) FROM incidents WHERE status = 'COMPLETED'")
    pending = await conn.fetchval("SELECT COUNT(*) FROM incidents WHERE status = 'PENDING'")
    
    # Mocking breakdown for now as we need complex Group By logic and DB is largely empty
    # In future: SELECT category_id, COUNT(*) ...
    return {
        "total_reports": total_reports,
        "today_reports": 0, # Placeholder
        "completed_reports": completed,
        "pending_reports": pending,
        "highest_risk_region": "Algiers", # Placeholder or geospatial query
        "type_breakdown": [
            {"label": "Fuites", "value": 54, "color": "blue"},
            {"label": "Inondations", "value": 20, "color": "green"},
            {"label": "Coupures", "value": 26, "color": "red"},
        ]
    }
