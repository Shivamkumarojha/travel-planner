from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import date, datetime

class Activity(BaseModel):
    activity: str = Field(..., description="Name or title of the activity")
    location: str = Field(..., description="Specific place or neighborhood")
    duration: str = Field(..., description="Estimated time e.g. 2h, 3.5h")
    cost: float = Field(default=0.0, description="Estimated cost per person")
    tips: Optional[str] = Field(default=None, description="Local insider tip or advice")
    category: Optional[str] = Field(default="Attraction", description="e.g. Landmark, Dining, Nature, Museum, Shopping")

class Accommodation(BaseModel):
    name: str = Field(..., description="Suggested hotel, hostel or rental name")
    type: str = Field(default="hotel", description="hotel, hostel, resort, or apartment")
    cost_per_night: float = Field(default=100.0, description="Cost per night")
    neighborhood: Optional[str] = Field(default=None, description="Recommended area to stay")

class Transport(BaseModel):
    mode: str = Field(default="metro", description="metro, bus, taxi, walking, rental")
    estimated_daily_cost: float = Field(default=15.0, description="Daily transit expenditure")
    tips: Optional[str] = Field(default=None, description="Travel transit advice")

class DayItinerary(BaseModel):
    day: int = Field(..., description="Day number (1, 2, ...)")
    date: Optional[str] = Field(default=None, description="YYYY-MM-DD")
    theme: str = Field(..., description="Main focus or theme for the day")
    morning: Activity
    afternoon: Activity
    evening: Activity
    accommodation: Accommodation
    transport: Transport

class BudgetBreakdown(BaseModel):
    accommodation_total: float
    activities_total: float
    food_dining_total: float
    transport_total: float
    misc_contingency: float
    total_estimated: float

class ItineraryData(BaseModel):
    destination: str
    country: Optional[str] = None
    summary: str
    highlights: List[str] = []
    total_estimated_cost: float
    currency: str = "USD"
    budget_breakdown: Optional[BudgetBreakdown] = None
    days: List[DayItinerary]

class TripRequest(BaseModel):
    destination: str
    start_date: str
    end_date: str
    duration_days: int = Field(default=3, ge=1, le=30)
    budget_total: float = Field(default=1000.0, ge=50.0)
    budget_currency: str = Field(default="USD")
    group_size: int = Field(default=1, ge=1, le=20)
    travel_style: str = Field(default="Balanced", description="Backpacker, Budget, Balanced, Luxury, Adventure, Relaxed")
    interests: List[str] = Field(default_factory=list, description="Culture, Food, Art, Nature, Nightlife, History, Shopping")
    user_id: Optional[str] = None

class TripSaveRequest(BaseModel):
    user_id: Optional[str] = None
    destination: str
    start_date: str
    end_date: str
    duration_days: int
    budget_total: float
    budget_currency: str = "USD"
    group_size: int = 1
    travel_style: str = "Balanced"
    interests: List[str] = []
    itinerary: Dict[str, Any]

class RegenerateDayRequest(BaseModel):
    trip_id: Optional[str] = None
    destination: str
    day_number: int
    date: Optional[str] = None
    current_day_data: Optional[Dict[str, Any]] = None
    user_feedback: Optional[str] = "Make it more adventurous and budget-friendly"
    interests: List[str] = []
    travel_style: str = "Balanced"

class TripResponse(BaseModel):
    id: str
    user_id: Optional[str]
    destination: str
    start_date: str
    end_date: str
    duration_days: int
    budget_total: float
    budget_currency: str
    group_size: int
    travel_style: str
    interests: List[str]
    itinerary: Dict[str, Any]
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
