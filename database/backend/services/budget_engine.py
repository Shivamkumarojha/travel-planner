"""
VoyageAI - Budget Optimization & Financial Engine
Language: Python 3.11+
Handles multi-currency conversions, daily cost pacing, and contingency buffers.
"""

from typing import Dict, Any, List
from dataclasses import dataclass
from enum import Enum

class TravelPace(Enum):
    BACKPACKER = "Backpacker"
    BUDGET = "Budget"
    BALANCED = "Balanced"
    LUXURY = "Luxury"
    ULTRA_LUXURY = "Ultra Luxury"

EXCHANGE_RATES = {
    "USD": 1.0,
    "EUR": 0.92,
    "GBP": 0.79,
    "INR": 83.25,
    "JPY": 155.40,
    "AUD": 1.52,
    "CAD": 1.37
}

@dataclass
class AllocationRatio:
    lodging_pct: float
    activities_pct: float
    food_dining_pct: float
    transport_pct: float
    buffer_pct: float

ALLOCATION_STRATEGIES: Dict[TravelPace, AllocationRatio] = {
    TravelPace.BACKPACKER: AllocationRatio(0.30, 0.25, 0.25, 0.12, 0.08),
    TravelPace.BUDGET: AllocationRatio(0.35, 0.25, 0.22, 0.10, 0.08),
    TravelPace.BALANCED: AllocationRatio(0.40, 0.25, 0.20, 0.10, 0.05),
    TravelPace.LUXURY: AllocationRatio(0.48, 0.22, 0.18, 0.08, 0.04),
    TravelPace.ULTRA_LUXURY: AllocationRatio(0.55, 0.20, 0.15, 0.07, 0.03)
}

class BudgetEngine:
    @staticmethod
    def convert_currency(amount: float, from_curr: str, to_curr: str) -> float:
        """Converts currency based on normalized baseline rates"""
        from_rate = EXCHANGE_RATES.get(from_curr.upper(), 1.0)
        to_rate = EXCHANGE_RATES.get(to_curr.upper(), 1.0)
        usd_amount = amount / from_rate
        return round(usd_amount * to_rate, 2)

    @classmethod
    def calculate_budget_breakdown(
        cls, 
        total_budget: float, 
        duration_days: int, 
        style_name: str, 
        currency: str = "USD"
    ) -> Dict[str, Any]:
        """
        Computes categorical budget expenditure and daily allowances
        """
        pace = TravelPace.BALANCED
        for p in TravelPace:
            if p.value.lower() == style_name.lower():
                pace = p
                break

        ratios = ALLOCATION_STRATEGIES[pace]
        effective_days = max(1, duration_days)

        lodging_total = round(total_budget * ratios.lodging_pct, 2)
        activities_total = round(total_budget * ratios.activities_pct, 2)
        food_total = round(total_budget * ratios.food_dining_pct, 2)
        transport_total = round(total_budget * ratios.transport_pct, 2)
        buffer_total = round(total_budget * ratios.buffer_pct, 2)

        return {
            "currency": currency,
            "total_budget": total_budget,
            "daily_allowance": round(total_budget / effective_days, 2),
            "lodging_total": lodging_total,
            "lodging_per_night": round(lodging_total / effective_days, 2),
            "activities_total": activities_total,
            "activities_daily": round(activities_total / effective_days, 2),
            "food_dining_total": food_total,
            "food_dining_daily": round(food_total / effective_days, 2),
            "transport_total": transport_total,
            "transport_daily": round(transport_total / effective_days, 2),
            "contingency_buffer": buffer_total,
            "allocation_percentages": {
                "lodging": int(ratios.lodging_pct * 100),
                "activities": int(ratios.activities_pct * 100),
                "food": int(ratios.food_dining_pct * 100),
                "transport": int(ratios.transport_pct * 100),
                "buffer": int(ratios.buffer_pct * 100)
            }
        }
