-- ====================================================================
-- VoyageAI - Seed Sample Datasets
-- Language: SQL
-- ====================================================================

-- 1. Insert Demo Profile
INSERT INTO public.profiles (id, full_name, email, preferred_currency, travel_style_preference)
VALUES 
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Alex Mercer', 'alex.mercer@voyage.ai', 'USD', 'Balanced'),
  ('b1ffcd88-8b1a-3de7-aa5c-5aa8ac270b22', 'Priya Sharma', 'priya.sharma@voyage.ai', 'INR', 'Luxury')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Seed Trips
INSERT INTO public.trips (
  id, user_id, destination, country, start_date, end_date, 
  duration_days, budget_total, budget_currency, group_size, travel_style, 
  interests, itinerary_payload, is_public
)
VALUES 
  (
    'c201df77-7a2b-2cd6-994b-4bb7bd160c33',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Tokyo, Japan',
    'Japan',
    '2025-09-10',
    '2025-09-14',
    4,
    2200.00,
    'USD',
    2,
    'Balanced',
    ARRAY['Culture', 'Food', 'Technology', 'Nightlife'],
    '{
      "destination": "Tokyo, Japan",
      "summary": "An extraordinary 4-day Tokyo expedition traversing historic Asakusa, buzzing Shinjuku alleys, and digital art marvels.",
      "total_estimated_cost": 2150.00,
      "currency": "USD"
    }'::jsonb,
    TRUE
  ),
  (
    'd312ef66-6b3c-1bc5-883a-3aa6ac050d44',
    'b1ffcd88-8b1a-3de7-aa5c-5aa8ac270b22',
    'Rome, Italy',
    'Italy',
    '2025-10-05',
    '2025-10-08',
    3,
    1500.00,
    'EUR',
    1,
    'Cultural & Heritage',
    ARRAY['History', 'Art', 'Italian Cuisine'],
    '{
      "destination": "Rome, Italy",
      "summary": "Ancient Roman ruins, Vatican artistic treasures, and twilight Trastevere culinary strolls.",
      "total_estimated_cost": 1420.00,
      "currency": "EUR"
    }'::jsonb,
    TRUE
  )
ON CONFLICT (id) DO NOTHING;
