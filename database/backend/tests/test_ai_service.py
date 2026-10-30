"""
VoyageAI - AI Service & Prompt Engineering Tests
Language: Python 3.11+
"""

import pytest
import asyncio
from services.ai_service import generate_dynamic_mock_itinerary, clean_json_text
from services.budget_engine import BudgetEngine
from services.weather_service import WeatherIntelligence

def test_clean_json_formatting():
    raw_markdown = "```json\n{\"destination\": \"Rome\"}\n```"
    cleaned = clean_json_text(raw_markdown)
    assert cleaned == '{"destination": "Rome"}'

def test_dynamic_mock_itinerary_structure():
    params = {
        "destination": "Kyoto, Japan",
        "duration_days": 3,
        "budget_total": 1500,
        "budget_currency": "USD",
        "travel_style": "Cultural",
        "interests": ["Temples", "Gardens", "Tea Ceremony"]
    }
    itin = generate_dynamic_mock_itinerary(params)
    assert itin["destination"] == "Kyoto, Japan"
    assert len(itin["days"]) == 3
    assert itin["total_estimated_cost"] == 1500
    assert "budget_breakdown" in itin
    assert "morning" in itin["days"][0]
    assert "afternoon" in itin["days"][0]
    assert "evening" in itin["days"][0]

def test_budget_engine_calculation():
    breakdown = BudgetEngine.calculate_budget_breakdown(
        total_budget=2000.0,
        duration_days=5,
        style_name="Balanced",
        currency="USD"
    )
    assert breakdown["daily_allowance"] == 400.0
    assert breakdown["lodging_total"] == 800.0
    assert breakdown["contingency_buffer"] > 0

def test_weather_intelligence():
    advisory = WeatherIntelligence.get_advisory("Tokyo, Japan", month=7)
    assert advisory["season"] == "Summer"
    assert advisory["average_temp_c"] > 25
    assert len(advisory["essential_packing_list"]) > 0
