import os
import uuid
import json
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime
from supabase import create_client, Client

logger = logging.getLogger(__name__)

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

supabase_client: Optional[Client] = None

if SUPABASE_URL and SUPABASE_KEY and "your-project" not in SUPABASE_URL:
    try:
        supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
        logger.info("Successfully connected to Supabase client.")
    except Exception as e:
        logger.warning(f"Could not initialize Supabase client: {e}. Using demo in-memory storage.")

# In-memory demo store for when Supabase is not configured
DEMO_STORAGE: Dict[str, Dict[str, Any]] = {}

# Seed initial sample trips for immediate testing in demo mode
SEED_TRIP_ID = "e83b48f1-5912-4f81-81d3-3f191b9204cd"
DEMO_STORAGE[SEED_TRIP_ID] = {
    "id": SEED_TRIP_ID,
    "user_id": "demo-user-123",
    "destination": "Tokyo, Japan",
    "start_date": "2025-09-10",
    "end_date": "2025-09-14",
    "duration_days": 4,
    "budget_total": 2400.0,
    "budget_currency": "USD",
    "group_size": 2,
    "travel_style": "Balanced",
    "interests": ["Culture", "Food", "Technology", "Nightlife"],
    "itinerary": {
        "destination": "Tokyo, Japan",
        "country": "Japan",
        "summary": "An unforgettable 4-day journey combining ancient Edo tradition, pulsating futuristic districts, and Michelin-worthy culinary adventures.",
        "highlights": ["Sunrise Senso-ji temple stroll", "Shibuya Sky sunset panorama", "teamLab immersive digital universe", "Shinjuku yakitori alley crawl"],
        "total_estimated_cost": 2150.0,
        "currency": "USD",
        "budget_breakdown": {
            "accommodation_total": 920.0,
            "activities_total": 540.0,
            "food_dining_total": 450.0,
            "transport_total": 120.0,
            "misc_contingency": 120.0,
            "total_estimated": 2150.0
        },
        "days": [
            {
                "day": 1,
                "date": "2025-09-10",
                "theme": "Historical Asakusa & Riverfront Orientation",
                "morning": {
                    "activity": "Senso-ji Temple & Nakamise Craft Alley",
                    "location": "Asakusa, Taito City",
                    "duration": "2.5h",
                    "cost": 15.0,
                    "tips": "Cleanse hands at the dragon fountain before approaching the main hall.",
                    "category": "Culture"
                },
                "afternoon": {
                    "activity": "Tokyo Skytree Observation Deck & Solamachi",
                    "location": "Oshiage, Sumida City",
                    "duration": "2.5h",
                    "cost": 30.0,
                    "tips": "Fast-pass saves 45 minutes during afternoon peak.",
                    "category": "Landmark"
                },
                "evening": {
                    "activity": "Sumida River Yakata-bune Dinner Boat",
                    "location": "Asakusa Pier",
                    "duration": "2.5h",
                    "cost": 65.0,
                    "tips": "Includes unlimited tempura and panoramic views of Rainbow Bridge.",
                    "category": "Dining"
                },
                "accommodation": {
                    "name": "Asakusa View Hotel",
                    "type": "hotel",
                    "cost_per_night": 230.0,
                    "neighborhood": "Asakusa"
                },
                "transport": {
                    "mode": "Tokyo Metro 72hr Tourist Pass",
                    "estimated_daily_cost": 12.0,
                    "tips": "Pick up at Haneda/Narita airport or major subway kiosks."
                }
            }
        ]
    },
    "created_at": datetime.now().isoformat(),
    "updated_at": datetime.now().isoformat()
}

async def fetch_trips_for_user(user_id: Optional[str] = None) -> List[Dict[str, Any]]:
    """Retrieve all trips for a given user or all demo trips"""
    if supabase_client:
        try:
            query = supabase_client.table("trips").select("*")
            if user_id:
                query = query.eq("user_id", user_id)
            res = query.order("created_at", desc=True).execute()
            return res.data or []
        except Exception as e:
            logger.error(f"Supabase fetch error: {e}. Falling back to demo storage.")
    
    # In-memory storage fallback
    if user_id:
        return [trip for trip in DEMO_STORAGE.values() if trip.get("user_id") in [user_id, "demo-user-123"]]
    return list(DEMO_STORAGE.values())

async def fetch_trip_by_id(trip_id: str) -> Optional[Dict[str, Any]]:
    """Fetch single trip by UUID"""
    if supabase_client:
        try:
            res = supabase_client.table("trips").select("*").eq("id", trip_id).single().execute()
            if res.data:
                return res.data
        except Exception as e:
            logger.error(f"Supabase fetch trip {trip_id} error: {e}")
    
    return DEMO_STORAGE.get(trip_id)

async def create_trip_record(trip_data: Dict[str, Any]) -> Dict[str, Any]:
    """Save a new trip to database or demo storage"""
    trip_id = str(uuid.uuid4())
    now_iso = datetime.now().isoformat()
    
    record = {
        "id": trip_id,
        "user_id": trip_data.get("user_id") or "demo-user-123",
        "destination": trip_data.get("destination", "Explore Destination"),
        "start_date": trip_data.get("start_date", "2025-06-01"),
        "end_date": trip_data.get("end_date", "2025-06-04"),
        "duration_days": trip_data.get("duration_days", 3),
        "budget_total": float(trip_data.get("budget_total", 1000.0)),
        "budget_currency": trip_data.get("budget_currency", "USD"),
        "group_size": int(trip_data.get("group_size", 1)),
        "travel_style": trip_data.get("travel_style", "Balanced"),
        "interests": trip_data.get("interests", []),
        "itinerary": trip_data.get("itinerary", {}),
        "created_at": now_iso,
        "updated_at": now_iso
    }

    if supabase_client:
        try:
            res = supabase_client.table("trips").insert(record).execute()
            if res.data and len(res.data) > 0:
                return res.data[0]
        except Exception as e:
            logger.error(f"Supabase insert error: {e}. Storing in demo cache.")
    
    DEMO_STORAGE[trip_id] = record
    return record

async def update_trip_record(trip_id: str, update_fields: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Update existing trip in database or demo storage"""
    update_fields["updated_at"] = datetime.now().isoformat()

    if supabase_client:
        try:
            res = supabase_client.table("trips").update(update_fields).eq("id", trip_id).execute()
            if res.data and len(res.data) > 0:
                return res.data[0]
        except Exception as e:
            logger.error(f"Supabase update error: {e}")

    if trip_id in DEMO_STORAGE:
        DEMO_STORAGE[trip_id].update(update_fields)
        return DEMO_STORAGE[trip_id]
    return None

async def delete_trip_record(trip_id: str) -> bool:
    """Delete a trip by ID"""
    if supabase_client:
        try:
            supabase_client.table("trips").delete().eq("id", trip_id).execute()
            return True
        except Exception as e:
            logger.error(f"Supabase delete error: {e}")

    if trip_id in DEMO_STORAGE:
        del DEMO_STORAGE[trip_id]
        return True
    return False
