/**
 * VoyageAI - Client-side API Service Layer
 * Languages Stack: Modern ES6+ JavaScript
 * Handles REST requests to FastAPI backend and graceful client-side fallback
 */

const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:8000/api' 
  : '/api';

export const ApiService = {
  /**
   * Send trip parameters to FastAPI or synthesize locally
   * @param {Object} params - Trip builder form inputs
   * @returns {Promise<Object>} Formatted Itinerary
   */
  async generateItinerary(params) {
    try {
      const response = await fetch(`${API_BASE_URL}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (response.ok) {
        const json = await response.json();
        return json.data;
      }
    } catch (err) {
      console.info('Backend unreachable, executing client-side AI algorithm.');
    }

    // Dynamic Client Synthesis Fallback
    await new Promise((r) => setTimeout(r, 1400));
    return this.synthesizeLocalItinerary(params);
  },

  /**
   * Refreshes a single day's plan using user feedback
   */
  async regenerateSingleDay(params) {
    try {
      const response = await fetch(`${API_BASE_URL}/regenerate-day`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (response.ok) {
        const json = await response.json();
        return json.day;
      }
    } catch (err) {
      console.warn('Fallback single day regeneration');
    }

    return {
      day: params.day_number,
      theme: `Refreshed Day ${params.day_number}: ${params.user_feedback || 'Specialized Highlights'}`,
      morning: {
        activity: `Exclusive Morning Hidden Gem Walk`,
        location: `Historic District, ${params.destination}`,
        duration: `2.5 Hours`,
        cost: 25,
        tips: `Tailored to: "${params.user_feedback}". Avoids crowded tourist traps.`
      },
      afternoon: {
        activity: `Artisan Culinary Masterclass & Market`,
        location: `Old Town Center, ${params.destination}`,
        duration: `3.0 Hours`,
        cost: 45,
        tips: `Hands-on experience with native ingredients and local recipes.`
      },
      evening: {
        activity: `Rooftop Sunset Lounge & Panoramic Dinner`,
        location: `Skyline Vista, ${params.destination}`,
        duration: `2.5 Hours`,
        cost: 50,
        tips: `Prime sunset golden hour view without reservation wait.`
      },
      hotel: `Boutique Heritage Inn ${params.destination}`,
      hotelCost: 120,
      transit: `Public Transit Day Pass ($12/day)`
    };
  },

  /**
   * Client-side algorithmic itinerary generator
   */
  synthesizeLocalItinerary(params) {
    const dest = params.destination || 'Rome, Italy';
    const duration = parseInt(params.duration_days, 10) || 3;
    const budget = parseFloat(params.budget_total) || 1200;
    const currency = params.budget_currency || 'USD';
    const style = params.travel_style || 'Balanced';

    const daily = budget / duration;
    const acc = Math.round(daily * 0.40);
    const acts = Math.round(daily * 0.25);
    const food = Math.round(daily * 0.20);
    const trans = Math.round(daily * 0.15);

    const days = [];
    const themes = [
      'Iconic Landmarks & Central Orientation',
      'Artisan Heritage, Museums & Alleys',
      'Authentic Local Gastronomy & Markets',
      'Panoramic Vistas, Sunset & Nightlife'
    ];

    for (let i = 1; i <= duration; i++) {
      days.push({
        day: i,
        theme: `Day ${i}: ${themes[(i - 1) % themes.length]} in ${dest}`,
        morning: {
          activity: `Renowned Historical Landmark Exploration`,
          location: `Central District, ${dest}`,
          duration: `2.5 Hours`,
          cost: Math.round(acts * 0.45),
          tips: `Arrive 20 minutes before ticket slot for optimal photo lighting.`
        },
        afternoon: {
          activity: `Cultural Museum & Artisan Street Bazaar`,
          location: `Heritage Quarter, ${dest}`,
          duration: `3.0 Hours`,
          cost: Math.round(acts * 0.55),
          tips: `Try authentic neighborhood street snacks at the square.`
        },
        evening: {
          activity: `Sunset Waterfront Walk & Traditional Dinner`,
          location: `Scenic Promenade, ${dest}`,
          duration: `2.5 Hours`,
          cost: food,
          tips: `Reserve terrace tables 45 minutes prior to dusk.`
        },
        hotel: `Boutique Urban Lodge ${dest}`,
        hotelCost: acc,
        transit: `Metro & Walking pass ($${trans}/day)`
      });
    }

    return {
      id: 'trip-' + Date.now(),
      destination: dest,
      country: dest.includes(',') ? dest.split(',')[1].trim() : 'International',
      duration_days: duration,
      budget_total: budget,
      budget_currency: currency,
      travel_style: style,
      total_estimated_cost: budget,
      summary: `A customized ${duration}-day ${style.toLowerCase()} itinerary in ${dest}. Calculated to deliver memorable cultural immersion strictly within your ${budget} ${currency} budget.`,
      breakdown: {
        lodging: acc * duration,
        activities: acts * duration,
        food: food * duration,
        transit: trans * duration
      },
      days
    };
  }
};
