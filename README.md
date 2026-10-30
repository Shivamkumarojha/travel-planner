# VoyageAI — Personalized Travel Itinerary Planner 🌍✈️

[![Live Demo](https://img.shields.io/badge/Live_Demo-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://travel-plannercom.netlify.app/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](backend/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](js/)
[![CSS3](https://img.shields.io/badge/CSS3-Design_Tokens-1572B6?style=for-the-badge&logo=css3&logoColor=white)](css/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase_SQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](database/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

> 🌐 **Live Website Link:** [https://travel-plannercom.netlify.app/](https://travel-plannercom.netlify.app/)

A full-stack, AI-powered travel planning SaaS web application built with a **polyglot multi-language architecture**: **Python**, **JavaScript**, **CSS3**, and **SQL**.

---

## 🛠️ Multi-Language Architecture (4 Languages)

This repository is organized to clearly demonstrate full-stack engineering proficiency across 4 core technologies:

| Language | Layer | Key Responsibilities & Files |
| :--- | :--- | :--- |
| **Python** 🐍 | **Backend & AI Engine** | FastAPI REST endpoints, Gemini 1.5 prompt engineering, [`budget_engine.py`](backend/services/budget_engine.py), [`weather_service.py`](backend/services/weather_service.py), and Pytest suites. |
| **JavaScript** ⚡ | **Frontend Logic** | Reactive state management, DOM rendering, client-side caching, Lucide icons integration in [`app.js`](js/app.js), and API client [`api.js`](js/api.js). |
| **CSS3** 🎨 | **Design System** | Custom CSS variables, dark glassmorphism effects, glowing gradients, responsive breakpoints in [`style.css`](css/style.css). |
| **SQL** 🗄️ | **Database & Security** | PostgreSQL DDL/DML, Row Level Security (RLS) policies, triggers, and analytics aggregation views in [`database/schema.sql`](database/schema.sql) and [`database/seed_data.sql`](database/seed_data.sql). |

---

## 📁 Repository Structure

```text
travel-planner/
├── .gitattributes             # GitHub Linguist language detection configuration
├── .gitignore                 # Standard exclusions for Python, Node & environment secrets
├── LICENSE                    # MIT Open Source License
├── README.md                  # Comprehensive documentation
├── index.html                 # Semantic HTML5 application entry point
├── vercel.json                # Vercel deployment rewrite rules
│
├── css/                       # [LANGUAGE: CSS]
│   └── style.css              # Custom properties, glassmorphism, responsive grid & animations
│
├── js/                        # [LANGUAGE: JAVASCRIPT]
│   ├── app.js                 # Application controller, state handling, DOM events
│   └── api.js                 # API service layer with fallback synthesis engine
│
├── backend/                   # [LANGUAGE: PYTHON]
│   ├── main.py                # FastAPI server entry point & CORS configuration
│   ├── requirements.txt       # Dependencies (FastAPI, Google Gemini, Supabase, Pytest)
│   ├── .env.example           # API keys and environment variables
│   ├── models/
│   │   └── schemas.py         # Pydantic data validation models
│   ├── routers/
│   │   └── itinerary.py       # REST API endpoints (/api/generate, /api/trips, etc.)
│   ├── services/
│   │   ├── ai_service.py      # Google Gemini 1.5 Flash prompt engineering
│   │   ├── budget_engine.py   # Currency conversion & pacing variance calculator
│   │   ├── weather_service.py # Destination climate & seasonal packing advisory
│   │   └── supabase_service.py# Database CRUD operations
│   └── tests/
│       ├── test_api.py        # Endpoint integration tests
│       └── test_ai_service.py # Unit tests for financial & AI services
│
├── database/                  # [LANGUAGE: SQL]
│   ├── schema.sql             # PostgreSQL tables, indexes, triggers & RLS policies
│   └── seed_data.sql          # Realistic sample trips, profiles, and itinerary days
│
└── frontend/                  # React 18 + Vite Component Source
    ├── package.json
    ├── vite.config.js
    └── src/                   # React Components, Context & Pages
```

---

## 🚀 Quickstart & Local Setup

### 1. Launch in Browser (Zero Installation)
Simply open [`index.html`](index.html) directly in any web browser, or preview on Netlify:  
👉 **[https://travel-plannercom.netlify.app/](https://travel-plannercom.netlify.app/)**

### 2. Python Backend Setup
```bash
cd backend
python -m venv venv

# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
API Documentation will be live at: `http://localhost:8000/docs`

### 3. Run Automated Python Tests
```bash
cd backend
pytest
```

### 4. Database Setup (Supabase / PostgreSQL)
Execute `database/schema.sql` and `database/seed_data.sql` inside your PostgreSQL database or Supabase SQL Editor.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
