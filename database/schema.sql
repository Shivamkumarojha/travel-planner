-- ====================================================================
-- VoyageAI - PostgreSQL / Supabase Schema Architecture
-- Language: SQL (DDL, DML, Triggers, Views & Row Level Security)
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. USERS PROFILE TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  preferred_currency TEXT DEFAULT 'USD',
  travel_style_preference TEXT DEFAULT 'Balanced',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TRIPS & ITINERARY TABLE
CREATE TABLE IF NOT EXISTS public.trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  destination TEXT NOT NULL,
  country TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  duration_days INTEGER NOT NULL CHECK (duration_days > 0),
  budget_total DECIMAL(12, 2) NOT NULL DEFAULT 1000.00 CHECK (budget_total >= 0),
  budget_currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  group_size INTEGER NOT NULL DEFAULT 1 CHECK (group_size >= 1),
  travel_style VARCHAR(50) DEFAULT 'Balanced',
  interests TEXT[] DEFAULT '{}',
  itinerary_payload JSONB NOT NULL,
  is_favorite BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ITINERARY DAYS TABLE (Relational Breakdown for Fast Analytics)
CREATE TABLE IF NOT EXISTS public.trip_days (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  calendar_date DATE,
  theme_title TEXT NOT NULL,
  morning_activity JSONB NOT NULL,
  afternoon_activity JSONB NOT NULL,
  evening_activity JSONB NOT NULL,
  lodging_recommendation JSONB,
  transit_guidance JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_trip_day UNIQUE (trip_id, day_number)
);

-- 5. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON public.trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_destination ON public.trips(destination);
CREATE INDEX IF NOT EXISTS idx_trips_created_at ON public.trips(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_trip_days_trip_id ON public.trip_days(trip_id);
CREATE INDEX IF NOT EXISTS idx_trips_payload_gin ON public.trips USING GIN (itinerary_payload);

-- 6. AUTOMATED TIMESTAMP TRIGGER
CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_trips_updated_at ON public.trips;
CREATE TRIGGER trg_trips_updated_at
  BEFORE UPDATE ON public.trips
  FOR EACH ROW
  EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- 7. STATS AGGREGATION VIEW
CREATE OR REPLACE VIEW public.vw_user_travel_metrics AS
SELECT
  user_id,
  COUNT(id) AS total_trips_planned,
  COALESCE(SUM(duration_days), 0) AS total_days_traveled,
  COALESCE(SUM(budget_total), 0) AS cumulative_budget_spent,
  COUNT(DISTINCT destination) AS unique_destinations_explored,
  MAX(created_at) AS last_trip_created_at
FROM public.trips
GROUP BY user_id;

-- 8. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_days ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own profile"
  ON public.profiles FOR ALL
  USING (auth.uid() = id);

CREATE POLICY "Users can view and manage their own trips"
  ON public.trips FOR ALL
  USING (auth.uid() = user_id OR is_public = TRUE);

CREATE POLICY "Users can manage their trip days"
  ON public.trip_days FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE public.trips.id = public.trip_days.trip_id
      AND (public.trips.user_id = auth.uid() OR public.trips.is_public = TRUE)
    )
  );
