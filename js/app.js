/**
 * VoyageAI - Core Frontend Controller & State Management
 * Languages Stack: Modern ES6+ JavaScript, DOM Manipulation, LocalStorage API
 */

import { ApiService } from './api.js';

class VoyageApp {
  constructor() {
    this.currentItinerary = null;
    this.savedTrips = this.loadSavedTrips();
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.ensureSeedData();
    this.refreshIcons();
  }

  loadSavedTrips() {
    try {
      const stored = localStorage.getItem('voyage_saved_trips_v2');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  saveTripsToStorage() {
    localStorage.setItem('voyage_saved_trips_v2', JSON.stringify(this.savedTrips));
  }

  ensureSeedData() {
    if (this.savedTrips.length === 0) {
      const seedItinerary = ApiService.synthesizeLocalItinerary({
        destination: 'Paris, France',
        duration_days: 4,
        budget_total: 1400,
        budget_currency: 'USD',
        travel_style: 'Balanced'
      });
      this.savedTrips.push(seedItinerary);
      this.saveTripsToStorage();
    }
  }

  setupEventListeners() {
    // Navigation routing
    window.showView = (viewName) => this.showView(viewName);
    window.setDest = (d) => this.setDestination(d);
    window.setParty = (size) => this.setPartySize(size);
    window.toggleTag = (btn) => this.toggleInterestTag(btn);
    window.goToStep = (step) => this.goToWizardStep(step);
    window.triggerGenerate = () => this.generateTrip();
    window.regenerateDay = (dayNum) => this.regenerateDay(dayNum);
    window.saveCurrentTrip = () => this.saveTrip();
    window.deleteTrip = (idx) => this.deleteTrip(idx);
    window.viewSavedTrip = (idx) => this.viewSavedTrip(idx);
  }

  showView(viewName) {
    document.querySelectorAll('.view-panel').forEach((el) => el.classList.add('hidden'));
    const target = document.getElementById(`view-${viewName}`);
    if (target) {
      target.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (viewName === 'dashboard') {
      this.renderDashboard();
    }
    this.refreshIcons();
  }

  setDestination(dest) {
    const input = document.getElementById('input-destination');
    if (input) input.value = dest;
  }

  setPartySize(size) {
    document.querySelectorAll('.party-btn').forEach((btn) => {
      btn.classList.remove('bg-purple-500/20', 'border-purple-500', 'text-white');
      btn.classList.add('bg-white/5', 'border-white/10', 'text-gray-400');
    });
    const target = document.getElementById(`party-${size}`);
    if (target) {
      target.classList.add('bg-purple-500/20', 'border-purple-500', 'text-white');
      target.classList.remove('bg-white/5', 'border-white/10', 'text-gray-400');
    }
  }

  toggleInterestTag(btn) {
    btn.classList.toggle('bg-teal-500/20');
    btn.classList.toggle('border-teal-500');
    btn.classList.toggle('text-teal-300');
    btn.classList.toggle('bg-white/5');
    btn.classList.toggle('border-white/10');
    btn.classList.toggle('text-gray-400');
  }

  goToWizardStep(step) {
    document.getElementById('builder-step-1')?.classList.add('hidden');
    document.getElementById('builder-step-2')?.classList.add('hidden');
    document.getElementById('builder-step-3')?.classList.add('hidden');
    document.getElementById(`builder-step-${step}`)?.classList.remove('hidden');

    for (let i = 1; i <= 3; i++) {
      const dot = document.getElementById(`step-dot-${i}`);
      if (dot) {
        dot.className = i <= step
          ? 'w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-purple-500/30'
          : 'w-9 h-9 rounded-full bg-gray-800 text-gray-400 flex items-center justify-center font-bold text-sm';
      }
    }
    this.refreshIcons();
  }

  async generateTrip() {
    document.getElementById('builder-step-3')?.classList.add('hidden');
    document.getElementById('builder-loading')?.classList.remove('hidden');

    const dest = document.getElementById('input-destination')?.value || 'Rome, Italy';
    const budget = parseFloat(document.getElementById('input-budget')?.value) || 1200;
    const currency = document.getElementById('input-currency')?.value || 'USD';
    const style = document.getElementById('input-style')?.value || 'Balanced';

    const sDate = new Date(document.getElementById('input-start-date')?.value || Date.now());
    const eDate = new Date(document.getElementById('input-end-date')?.value || (Date.now() + 3 * 86400000));
    const days = Math.max(1, Math.ceil(Math.abs(eDate - sDate) / (1000 * 60 * 60 * 24)) + 1) || 3;

    try {
      this.currentItinerary = await ApiService.generateItinerary({
        destination: dest,
        duration_days: days,
        budget_total: budget,
        budget_currency: currency,
        travel_style: style
      });

      document.getElementById('builder-loading')?.classList.add('hidden');
      document.getElementById('builder-step-1')?.classList.remove('hidden');
      this.goToWizardStep(1);

      this.renderItineraryView(this.currentItinerary);
      this.showView('itinerary');
    } catch (e) {
      console.error('Trip generation error', e);
      document.getElementById('builder-loading')?.classList.add('hidden');
      document.getElementById('builder-step-3')?.classList.remove('hidden');
      alert('Could not complete generation. Please try again.');
    }
  }

  renderItineraryView(itin) {
    document.getElementById('itinerary-title').innerText = itin.destination;
    document.getElementById('itinerary-country').innerText = itin.country || 'Global';
    document.getElementById('itinerary-days-badge').innerText = `${itin.duration_days} Days Plan`;
    document.getElementById('itinerary-cost').innerText = `$${itin.budget_total} ${itin.budget_currency || 'USD'}`;
    document.getElementById('itinerary-summary').innerText = itin.summary;

    document.getElementById('budget-lodging').innerText = `$${itin.breakdown.lodging}`;
    document.getElementById('budget-activities').innerText = `$${itin.breakdown.activities}`;
    document.getElementById('budget-food').innerText = `$${itin.breakdown.food}`;
    document.getElementById('budget-transit').innerText = `$${itin.breakdown.transit}`;

    const container = document.getElementById('days-container');
    container.innerHTML = '';

    itin.days.forEach((d) => {
      const card = document.createElement('div');
      card.className = 'glass-card p-6 border-l-4 border-l-purple-500 mb-6';
      card.innerHTML = `
        <div class="flex justify-between items-center mb-4 flex-wrap gap-2">
          <div class="flex items-center gap-3">
            <span class="px-3 py-1 bg-purple-500/20 text-purple-300 font-extrabold text-xs rounded-lg uppercase">DAY ${d.day}</span>
            <h3 class="text-lg font-bold">${d.theme}</h3>
          </div>
          <button onclick="regenerateDay(${d.day})" class="text-xs px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/10 text-gray-300 flex items-center gap-1.5 cursor-pointer">
            <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i> Custom Tweak Day
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div class="activity-card">
            <span class="text-xs font-bold text-purple-400 uppercase block mb-1">Morning</span>
            <h4 class="font-bold text-sm mb-1">${d.morning.activity}</h4>
            <p class="text-xs text-gray-400 mb-2">${d.morning.location} • ${d.morning.duration}</p>
            <div class="tip-box">💡 ${d.morning.tips}</div>
          </div>

          <div class="activity-card">
            <span class="text-xs font-bold text-teal-400 uppercase block mb-1">Afternoon</span>
            <h4 class="font-bold text-sm mb-1">${d.afternoon.activity}</h4>
            <p class="text-xs text-gray-400 mb-2">${d.afternoon.location} • ${d.afternoon.duration}</p>
            <div class="tip-box">💡 ${d.afternoon.tips}</div>
          </div>

          <div class="activity-card">
            <span class="text-xs font-bold text-pink-400 uppercase block mb-1">Evening</span>
            <h4 class="font-bold text-sm mb-1">${d.evening.activity}</h4>
            <p class="text-xs text-gray-400 mb-2">${d.evening.location} • ${d.evening.duration}</p>
            <div class="tip-box">💡 ${d.evening.tips}</div>
          </div>
        </div>

        <div class="flex justify-between items-center text-xs text-gray-400 pt-3 border-t border-white/5 flex-wrap gap-2">
          <span>🏨 <strong>Lodging:</strong> ${d.hotel} (~$${d.hotelCost}/night)</span>
          <span>🚇 <strong>Transit:</strong> ${d.transit}</span>
        </div>
      `;
      container.appendChild(card);
    });

    this.refreshIcons();
  }

  async regenerateDay(dayNum) {
    const promptMsg = prompt(
      "Enter custom preference for this day (e.g. 'More rooftop cafes & shopping', 'Add museum tour'):"
    );
    if (!promptMsg || !this.currentItinerary) return;

    const refreshed = await ApiService.regenerateSingleDay({
      destination: this.currentItinerary.destination,
      day_number: dayNum,
      user_feedback: promptMsg
    });

    const targetDay = this.currentItinerary.days.find((d) => d.day === dayNum);
    if (targetDay) {
      Object.assign(targetDay, refreshed);
      this.renderItineraryView(this.currentItinerary);
    }
  }

  saveTrip() {
    if (!this.currentItinerary) return;
    this.savedTrips.unshift(this.currentItinerary);
    this.saveTripsToStorage();

    const btn = document.getElementById('save-trip-btn');
    if (btn) {
      btn.innerHTML = `<i data-lucide="check" class="w-4 h-4"></i> Saved!`;
      btn.className = 'btn bg-teal-600 text-white font-semibold text-sm px-5 py-2 rounded-xl flex items-center gap-2';
    }
    this.refreshIcons();
    setTimeout(() => this.showView('dashboard'), 750);
  }

  renderDashboard() {
    const grid = document.getElementById('saved-trips-grid');
    if (!grid) return;
    grid.innerHTML = '';

    document.getElementById('stat-trips-count').innerText = this.savedTrips.length;
    document.getElementById('stat-cities-count').innerText = new Set(this.savedTrips.map((t) => t.destination)).size;
    document.getElementById('stat-days-count').innerText = this.savedTrips.reduce((a, b) => a + (b.duration_days || 0), 0);
    document.getElementById('stat-budget-count').innerText = `$${this.savedTrips.reduce((a, b) => a + (b.budget_total || 0), 0)}`;

    this.savedTrips.forEach((t, idx) => {
      const card = document.createElement('div');
      card.className = 'glass-card p-6 flex flex-col justify-between';
      card.innerHTML = `
        <div>
          <div class="flex justify-between items-start mb-3">
            <span class="badge badge-purple">
              ${t.travel_style || 'Balanced'}
            </span>
            <button onclick="deleteTrip(${idx})" class="text-rose-400 hover:text-rose-300 text-xs p-1 cursor-pointer">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
          <h3 class="text-xl font-bold mb-1">${t.destination}</h3>
          <p class="text-xs text-gray-400 mb-4">${t.duration_days || 3} Days • Budget: $${t.budget_total} ${t.budget_currency || 'USD'}</p>
        </div>
        <button onclick="viewSavedTrip(${idx})" class="w-full mt-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer">
          <span>Open Itinerary</span>
          <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
        </button>
      `;
      grid.appendChild(card);
    });

    this.refreshIcons();
  }

  viewSavedTrip(idx) {
    this.currentItinerary = this.savedTrips[idx];
    this.renderItineraryView(this.currentItinerary);
    this.showView('itinerary');
  }

  deleteTrip(idx) {
    if (confirm('Delete this saved trip?')) {
      this.savedTrips.splice(idx, 1);
      this.saveTripsToStorage();
      this.renderDashboard();
    }
  }

  refreshIcons() {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
}

// Instantiate on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new VoyageApp();
});
