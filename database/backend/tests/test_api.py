import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "fastapi-backend"

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"

def test_generate_itinerary():
    payload = {
        "destination": "Rome, Italy",
        "start_date": "2025-07-01",
        "end_date": "2025-07-04",
        "duration_days": 3,
        "budget_total": 1200.0,
        "budget_currency": "EUR",
        "group_size": 2,
        "travel_style": "Balanced",
        "interests": ["History", "Food", "Art"]
    }
    response = client.post("/api/generate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "data" in data
    itinerary = data["data"]
    assert itinerary["destination"] == "Rome, Italy"
    assert len(itinerary["days"]) == 3

def test_trips_crud():
    # 1. Fetch saved trips
    get_res = client.get("/api/trips")
    assert get_res.status_code == 200
    initial_count = len(get_res.json()["trips"])

    # 2. Save a new trip
    trip_payload = {
        "user_id": "test-user-456",
        "destination": "Barcelona, Spain",
        "start_date": "2025-08-10",
        "end_date": "2025-08-13",
        "duration_days": 3,
        "budget_total": 1000.0,
        "budget_currency": "EUR",
        "group_size": 1,
        "travel_style": "Backpacker",
        "interests": ["Architecture", "Beaches"],
        "itinerary": {
            "destination": "Barcelona, Spain",
            "summary": "Mediterranean architecture and seaside culture.",
            "total_estimated_cost": 950.0,
            "currency": "EUR",
            "days": []
        }
    }
    save_res = client.post("/api/trips", json=trip_payload)
    assert save_res.status_code == 201
    saved_trip = save_res.json()["trip"]
    trip_id = saved_trip["id"]

    # 3. Fetch single trip
    single_res = client.get(f"/api/trips/{trip_id}")
    assert single_res.status_code == 200
    assert single_res.json()["trip"]["destination"] == "Barcelona, Spain"

    # 4. Delete the trip
    del_res = client.delete(f"/api/trips/{trip_id}")
    assert del_res.status_code == 200
