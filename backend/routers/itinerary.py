import logging
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Query, status

from models.schemas import (
    TripRequest,
    TripSaveRequest,
    TripResponse,
    ItineraryData,
    RegenerateDayRequest
)
from services.ai_service import generate_itinerary_ai, regenerate_single_day_ai
from services.supabase_service import (
    fetch_trips_for_user,
    fetch_trip_by_id,
    create_trip_record,
    update_trip_record,
    delete_trip_record
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["Itineraries & Trips"])

@router.post("/generate", response_model=Dict[str, Any], status_code=status.HTTP_200_OK)
async def generate_itinerary_endpoint(request: TripRequest):
    """
    Generate an AI-powered personalized itinerary based on destination, dates, budget, and travel style.
    """
    try:
        itinerary = await generate_itinerary_ai(request.model_dump())
        return {
            "success": True,
            "data": itinerary
        }
    except Exception as e:
        logger.error(f"Error in generate_itinerary: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate itinerary: {str(e)}")

@router.post("/regenerate-day", response_model=Dict[str, Any])
async def regenerate_day_endpoint(request: RegenerateDayRequest):
    """
    Regenerate or customize a specific day of an itinerary.
    """
    try:
        refreshed_day = await regenerate_single_day_ai(request.model_dump())
        return {
            "success": True,
            "day": refreshed_day
        }
    except Exception as e:
        logger.error(f"Error in regenerate_day: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to regenerate day: {str(e)}")

@router.get("/trips", response_model=Dict[str, Any])
async def get_trips_endpoint(user_id: Optional[str] = Query(None, description="Optional Supabase User UUID")):
    """
    Fetch all saved trips for the user or demo environment.
    """
    try:
        trips = await fetch_trips_for_user(user_id)
        return {
            "success": True,
            "count": len(trips),
            "trips": trips
        }
    except Exception as e:
        logger.error(f"Error fetching trips: {e}")
        raise HTTPException(status_code=500, detail="Could not retrieve trips.")

@router.get("/trips/{trip_id}", response_model=Dict[str, Any])
async def get_single_trip_endpoint(trip_id: str):
    """
    Fetch a single trip by ID.
    """
    trip = await fetch_trip_by_id(trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found.")
    return {
        "success": True,
        "trip": trip
    }

@router.post("/trips", response_model=Dict[str, Any], status_code=status.HTTP_201_CREATED)
async def save_trip_endpoint(trip_data: TripSaveRequest):
    """
    Save an itinerary to the user's dashboard.
    """
    try:
        saved_record = await create_trip_record(trip_data.model_dump())
        return {
            "success": True,
            "message": "Trip saved successfully",
            "trip": saved_record
        }
    except Exception as e:
        logger.error(f"Error saving trip: {e}")
        raise HTTPException(status_code=500, detail="Failed to save trip.")

@router.put("/trips/{trip_id}", response_model=Dict[str, Any])
async def update_trip_endpoint(trip_id: str, update_data: Dict[str, Any]):
    """
    Update trip details or modified itinerary.
    """
    updated = await update_trip_record(trip_id, update_data)
    if not updated:
        raise HTTPException(status_code=404, detail="Trip not found.")
    return {
        "success": True,
        "message": "Trip updated",
        "trip": updated
    }

@router.delete("/trips/{trip_id}", response_model=Dict[str, Any])
async def delete_trip_endpoint(trip_id: str):
    """
    Delete a trip from database.
    """
    deleted = await delete_trip_record(trip_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Trip not found or could not be removed.")
    return {
        "success": True,
        "message": "Trip deleted successfully"
    }
