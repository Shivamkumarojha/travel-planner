const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Intelligent mock data generator for when the Python FastAPI server is offline
function generateLocalMockItinerary(params) {
  const dest = params.destination || 'Paris, France';
  const duration = parseInt(params.duration_days || 3, 10);
  const budget = parseFloat(params.budget_total || 1200);
  const currency = params.budget_currency || 'USD';
  const travelStyle = params.travel_style || 'Balanced';
  const interests = params.interests?.length ? params.interests : ['Culture', 'Local Dining', 'Sightseeing'];

  const days = [];
  const dailyBudget = budget / Math.max(duration, 1);
  const accDaily = Math.round(dailyBudget * 0.42);
  const actDaily = Math.round(dailyBudget * 0.28);
  const foodDaily = Math.round(dailyBudget * 0.2);
  const transDaily = Math.round(dailyBudget * 0.1);

  const sampleActivities = [
    {
      m: { act: 'Historic Landmark & Architectural Tour', loc: `Old Town District, ${dest}`, dur: '2.5h', cost: Math.round(actDaily * 0.4), tips: 'Book tickets online 48 hours early to bypass morning queues.', cat: 'Landmark' },
      a: { act: 'Immersive Cultural Museum & Artisan Market', loc: `Cultural Quarter, ${dest}`, dur: '3.0h', cost: Math.round(actDaily * 0.6), tips: 'Local artists hold open galleries along the cobblestone lane.', cat: 'Culture' },
      e: { act: 'Panoramic Sunset Dining & River Promenade', loc: `Scenic Waterfront, ${dest}`, dur: '2.5h', cost: foodDaily, tips: 'Reserve an outdoor deck table 30 mins before sunset.', cat: 'Dining' }
    },
    {
      m: { act: 'Scenic Hilltop Viewpoint & Heritage Walk', loc: `Upper Vista, ${dest}`, dur: '2.0h', cost: Math.round(actDaily * 0.35), tips: 'The morning light offers ideal glare-free photo perspectives.', cat: 'Nature' },
      a: { act: 'Culinary Tasting Trail & Street Food Stalls', loc: `Central Food Bazaar, ${dest}`, dur: '2.5h', cost: Math.round(actDaily * 0.65), tips: 'Follow stalls with the longest local patrons for peak freshness.', cat: 'Food' },
      e: { act: 'Acoustic Live Music & Artisan Craft Cocktails', loc: `Bohemian Alley, ${dest}`, dur: '3.0h', cost: foodDaily, tips: 'Try the house signature botanical beverage.', cat: 'Nightlife' }
    },
    {
      m: { act: 'Royal Botanical Gardens & Sculpture Walk', loc: `West Garden Park, ${dest}`, dur: '2.0h', cost: Math.round(actDaily * 0.3), tips: 'Rent a tandem bicycle near the south gate for fast traversal.', cat: 'Nature' },
      a: { act: 'Vintage Shopping & Specialty Coffee Tasting', loc: `Design Row, ${dest}`, dur: '2.5h', cost: Math.round(actDaily * 0.7), tips: 'Many independent boutiques offer tax-free traveler discounts.', cat: 'Shopping' },
      e: { act: 'Illuminated Evening Skyline Tour & Dinner', loc: `Harbor Pier, ${dest}`, dur: '2.5h', cost: foodDaily, tips: 'Breezy on the water; carry a light jacket.', cat: 'Experience' }
    }
  ];

  for (let i = 1; i <= duration; i++) {
    const actSet = sampleActivities[(i - 1) % sampleActivities.length];
    days.push({
      day: i,
      date: new Date(Date.now() + (i - 1) * 86400000).toISOString().split('T')[0],
      theme: `Day ${i}: ${['City Highlights & Orientation', 'Heritage & Cultural Exploration', 'Hidden Gems & Gastronomy', 'Scenic Panorama & Leisure'][(i - 1) % 4]}`,
      morning: {
        activity: actSet.m.act,
        location: actSet.m.loc,
        duration: actSet.m.dur,
        cost: actSet.m.cost,
        tips: actSet.m.tips,
        category: actSet.m.cat
      },
      afternoon: {
        activity: actSet.a.act,
        location: actSet.a.loc,
        duration: actSet.a.dur,
        cost: actSet.a.cost,
        tips: actSet.a.tips,
        category: actSet.a.cat
      },
      evening: {
        activity: actSet.e.act,
        location: actSet.e.loc,
        duration: actSet.e.dur,
        cost: actSet.e.cost,
        tips: actSet.e.tips,
        category: actSet.e.cat
      },
      accommodation: {
        name: `The Grand Boutique Lodge ${dest}`,
        type: travelStyle === 'Backpacker' ? 'Social Hostel' : 'Boutique Hotel',
        cost_per_night: accDaily,
        neighborhood: 'Central Historic District'
      },
      transport: {
        mode: 'Metro & Scenic Walking',
        estimated_daily_cost: transDaily,
        tips: 'Get an all-inclusive 3-day transit pass at any central kiosk.'
      }
    });
  }

  return {
    destination: dest,
    country: 'Featured Destination',
    summary: `A masterfully designed ${duration}-day ${travelStyle.toLowerCase()} itinerary in ${dest}. Perfectly tailored around ${interests.slice(0, 3).join(', ')} with total estimated expenditures fitting inside your ${budget} ${currency} budget.`,
    highlights: [
      `Signature cultural landmarks and viewpoints of ${dest}`,
      'Authentic regional culinary tastings and vibrant food halls',
      'Curated local boutique stays in walkable central neighborhoods',
      'Stress-free optimized transit pacing with insider navigation tips'
    ],
    total_estimated_cost: budget,
    currency,
    budget_breakdown: {
      accommodation_total: Math.round(accDaily * duration),
      activities_total: Math.round(actDaily * duration),
      food_dining_total: Math.round(foodDaily * duration),
      transport_total: Math.round(transDaily * duration),
      misc_contingency: Math.round(budget * 0.05),
      total_estimated: budget
    },
    days
  };
}

export const api = {
  // 1. Generate Itinerary
  async generateItinerary(params) {
    try {
      const response = await fetch(`${API_BASE_URL}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (response.ok) {
        const data = await response.json();
        return data.data;
      }
    } catch (err) {
      console.warn('Backend API unavailable. Using seamless client generation:', err);
    }
    // Fallback: client generation
    await new Promise((res) => setTimeout(res, 1200)); // realistic UX delay
    return generateLocalMockItinerary(params);
  },

  // 2. Regenerate single day
  async regenerateDay(params) {
    try {
      const response = await fetch(`${API_BASE_URL}/regenerate-day`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (response.ok) {
        const data = await response.json();
        return data.day;
      }
    } catch (err) {
      console.warn('Backend API unavailable for regenerate day:', err);
    }

    // Fallback
    await new Promise((res) => setTimeout(res, 800));
    return {
      day: params.day_number,
      date: params.date || new Date().toISOString().split('T')[0],
      theme: `Refreshed Day ${params.day_number}: Custom Tailored Activities`,
      morning: {
        activity: `Exclusive Off-the-Beaten-Path Sightseeing`,
        location: `Historic District, ${params.destination}`,
        duration: '2.5h',
        cost: 30,
        tips: `Tailored to your preference: "${params.user_feedback || 'More adventure'}"`,
        category: 'Adventure'
      },
      afternoon: {
        activity: `Artisan Workshop & Traditional Masterclass`,
        location: `Artisans Row, ${params.destination}`,
        duration: '3.0h',
        cost: 45,
        tips: 'Includes hands-on crafting and regional beverage tasting.',
        category: 'Culture'
      },
      evening: {
        activity: `Hidden Rooftop Sunset Dinner`,
        location: `Panoramic Hill, ${params.destination}`,
        duration: '2.5h',
        cost: 50,
        tips: 'Incredible skyline view without the tourist crowds.',
        category: 'Dining'
      },
      accommodation: {
        name: `Boutique Heritage Suite ${params.destination}`,
        type: 'hotel',
        cost_per_night: 110,
        neighborhood: 'Old Town Quarter'
      },
      transport: {
        mode: 'Metro / Walking',
        estimated_daily_cost: 12,
        tips: 'Fast connections via city transit app.'
      }
    };
  },

  // 3. Fetch saved trips
  async fetchTrips(userId) {
    try {
      const url = userId ? `${API_BASE_URL}/trips?user_id=${userId}` : `${API_BASE_URL}/trips`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        return data.trips;
      }
    } catch (err) {
      console.warn('Backend unavailable, reading trips from local storage');
    }

    // LocalStorage fallback
    const local = localStorage.getItem('voyage_saved_trips');
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {}
    }
    // Default initial sample trip
    return [
      {
        id: 'sample-trip-tokyo',
        destination: 'Tokyo, Japan',
        start_date: '2025-09-10',
        end_date: '2025-09-14',
        duration_days: 4,
        budget_total: 2400,
        budget_currency: 'USD',
        group_size: 2,
        travel_style: 'Balanced',
        interests: ['Culture', 'Food', 'Technology'],
        created_at: new Date().toISOString(),
        itinerary: generateLocalMockItinerary({
          destination: 'Tokyo, Japan',
          duration_days: 4,
          budget_total: 2400,
          budget_currency: 'USD',
          travel_style: 'Balanced',
          interests: ['Culture', 'Food', 'Technology']
        })
      }
    ];
  },

  // 4. Save trip
  async saveTrip(tripData) {
    try {
      const response = await fetch(`${API_BASE_URL}/trips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tripData)
      });
      if (response.ok) {
        const data = await response.json();
        return data.trip;
      }
    } catch (err) {
      console.warn('Backend unavailable, saving trip locally:', err);
    }

    // LocalStorage save
    const local = localStorage.getItem('voyage_saved_trips');
    let trips = local ? JSON.parse(local) : [];
    const newRecord = {
      id: 'trip-' + Date.now(),
      ...tripData,
      created_at: new Date().toISOString()
    };
    trips.unshift(newRecord);
    localStorage.setItem('voyage_saved_trips', JSON.stringify(trips));
    return newRecord;
  },

  // 5. Delete trip
  async deleteTrip(tripId) {
    try {
      const response = await fetch(`${API_BASE_URL}/trips/${tripId}`, {
        method: 'DELETE'
      });
      if (response.ok) return true;
    } catch (err) {
      console.warn('Backend unavailable, deleting locally:', err);
    }

    const local = localStorage.getItem('voyage_saved_trips');
    if (local) {
      const trips = JSON.parse(local).filter((t) => t.id !== tripId);
      localStorage.setItem('voyage_saved_trips', JSON.stringify(trips));
    }
    return true;
  }
};
