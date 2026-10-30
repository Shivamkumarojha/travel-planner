"""
VoyageAI - Destination Climate & Seasonal Intelligence Service
Language: Python 3.11+
Evaluates destination seasonality, optimum clothing checklists, and indoor/outdoor weather splits.
"""

from typing import Dict, Any, List

SEASONAL_DATABASE: Dict[str, Dict[str, Any]] = {
    "paris": {
        "spring": {"temp_c": 16, "condition": "Mild & Blossoming", "rain_risk": "Moderate", "pack": ["Light Trench Coat", "Umbrella", "Comfortable Walking Shoes"]},
        "summer": {"temp_c": 26, "condition": "Warm & Sunny", "rain_risk": "Low", "pack": ["Sunglasses", "Linen Shirts", "Breathable Footwear"]},
        "autumn": {"temp_c": 15, "condition": "Crisp & Foliage", "rain_risk": "Moderate", "pack": ["Wool Sweater", "Scarf", "Waterproof Boots"]},
        "winter": {"temp_c": 6, "condition": "Chilly & Festive", "rain_risk": "High", "pack": ["Heavy Winter Coat", "Thermal Innerwear", "Beanie"]}
    },
    "tokyo": {
        "spring": {"temp_c": 18, "condition": "Cherry Blossom Bloom", "rain_risk": "Low", "pack": ["Layered Jacket", "Cardigan", "Slip-on Shoes"]},
        "summer": {"temp_c": 31, "condition": "Humid & Energetic", "rain_risk": "High", "pack": ["Handheld Fan", "Sunscreen", "Quick-dry Shorts"]},
        "autumn": {"temp_c": 19, "condition": "Pleasant & Clear", "rain_risk": "Low", "pack": ["Light Leather Jacket", "Jeans", "Comfortable Walkers"]},
        "winter": {"temp_c": 9, "condition": "Crisp Skies & Dry", "rain_risk": "Very Low", "pack": ["Down Jacket", "Warm Gloves", "Thick Socks"]}
    },
    "default": {
        "spring": {"temp_c": 20, "condition": "Temperate & Breezy", "rain_risk": "Low", "pack": ["Light Layers", "Walking Shoes", "Power Bank"]},
        "summer": {"temp_c": 28, "condition": "Sunny & Vibrant", "rain_risk": "Low", "pack": ["Hat", "Sun Protection", "Light Apparel"]},
        "autumn": {"temp_c": 18, "condition": "Mild Transition", "rain_risk": "Moderate", "pack": ["Midweight Jacket", "Scarf"]},
        "winter": {"temp_c": 8, "condition": "Cool Conditions", "rain_risk": "Moderate", "pack": ["Thermal Coat", "Warm Headwear"]}
    }
}

class WeatherIntelligence:
    @staticmethod
    def get_season(month: int) -> str:
        """Determines season from calendar month index"""
        if month in [3, 4, 5]:
            return "spring"
        elif month in [6, 7, 8]:
            return "summer"
        elif month in [9, 10, 11]:
            return "autumn"
        return "winter"

    @classmethod
    def get_advisory(cls, destination: str, month: int = 6) -> Dict[str, Any]:
        """Returns weather profile, temperature and packing tips for destination"""
        dest_clean = destination.lower()
        key = "default"
        for city in ["paris", "tokyo"]:
            if city in dest_clean:
                key = city
                break

        season = cls.get_season(month)
        forecast = SEASONAL_DATABASE[key][season]

        return {
            "destination": destination,
            "season": season.capitalize(),
            "average_temp_c": forecast["temp_c"],
            "average_temp_f": round(forecast["temp_c"] * 9 / 5 + 32, 1),
            "condition": forecast["condition"],
            "rain_probability": forecast["rain_risk"],
            "essential_packing_list": forecast["pack"]
        }
