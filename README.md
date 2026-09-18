# 🌱 KhedutMitra (Farmer's Friend)

![Hackathon Submission](https://img.shields.io/badge/CodeCraft-'26-Submission-15803d?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Supabase](https://img.shields.io/badge/Supabase-DB-3ECF8E?style=for-the-badge&logo=supabase)

**KhedutMitra** is a comprehensive, multilingual digital platform designed to empower Indian farmers with real-time data, AI-driven advisory, and direct market access. Built as a submission for CodeCraft '26.

## 🎯 Problem Statement
Indian farmers face numerous challenges including unpredictable weather patterns, lack of localized and timely crop advice, middlemen capturing the majority of agricultural profits, and poor awareness of beneficial government schemes. Existing agricultural apps are often fragmented, poorly localized, or lack comprehensive, actionable insights tailored for the diverse linguistic and geographical landscape of India.

## 💡 Proposed Solution
KhedutMitra acts as a one-stop digital companion ("Mitra") for farmers. It unifies weather forecasts, market prices, AI-driven crop advisory, community knowledge sharing, and a direct farmer-to-consumer marketplace into a single, intuitive, mobile-first web application. The platform provides hyper-local data and supports multiple regional languages (English, Hindi, Gujarati) to ensure accessibility for all farmers.

## ✨ Features
- **Role-Based Access:** Dedicated interfaces for Farmers (producers) and Consumers/Buyers.
- **Multilingual Support:** Native language toggling (English, Hindi, Gujarati) with persistent preferences.
- **Direct Marketplace:** P2P crop listings to bypass middlemen and maximize farmer profits.
- **Smart Weather & Advisories:** Hyper-local forecasts via Open-Meteo with automated agricultural advisories.
- **Agri Market:** A categorized catalog for agricultural inputs (seeds, fertilizers, tools).
- **Disease Tracker:** ML-powered plant disease diagnosis via image upload.
- **AI Crop Advice:** Dynamic query system providing tailored fertilization and pest control recommendations.
- **Government Schemes Directory:** Curated and filtered list of active agricultural subsidies and programs.
- **Farmer Community:** Interactive Q&A forum connecting farmers with agricultural experts.

## 💻 Technology Stack
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide React.
- **Backend:** Node.js, Express, Axios.
- **Database:** Supabase (PostgreSQL) with Row Level Security (RLS).
- **Hosting / Deployment:** Vercel (Frontend), Render (Backend), Supabase (Database).
- **External Services:** Open-Meteo API, AGMARKNET adapter, AI/ML APIs.

## 🏗️ System Architecture
The application follows a standard modern Client-Server architecture:
- **Client (React SPA):** Handles routing, state management (Context API), i18n, and UI rendering. Communicates with the backend and Supabase.
- **Backend Proxy (Express):** Serves as an API gateway to securely manage external API keys, proxy requests to Open-Meteo, AGMARKNET, and interface with AI models.
- **Database (Supabase):** Stores user profiles, marketplace listings, community posts, and products. Uses PostgreSQL Row Level Security (RLS) to enforce data privacy and access control directly at the database layer.

## 🔌 APIs & Third-Party Services
All external services are proxy-handled via our Express backend to protect secrets:
- **Open-Meteo API:** Used for real-time and forecasted weather data based on district coordinates.
- **AGMARKNET (data.gov.in):** Mock/Adapter used for fetching regional mandi (market) prices for crops.
- **AI & ML Services:** Used for the Crop Advice and Disease Tracker modules.
- **Supabase Auth API:** Manages user authentication (Phone + Password).

*Note: As per hackathon rules, no API keys or secrets are committed to this repository. See `.env.example`.*

## 🗄️ Database
We use **Supabase (PostgreSQL)**. Key tables include:
- `profiles` & `farm_profiles`: User identity and agricultural profile.
- `crop_listings`: Farmer-to-consumer direct market items.
- `community_posts` & `community_answers`: Farmer Q&A forum data.
- `agri_products` & `government_schemes`: Catalogs for inputs and subsidies.

For a full breakdown of the schema and RLS policies, see [03-DB-SCHEMA.md](./docs/03-DB-SCHEMA.md).

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/KhedutMitra.git
cd KhedutMitra
```

### 2. Environment Variables
To comply with security rules, no secrets are tracked in Git.
1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Fill in the `.env` file with your Supabase URL/Anon Key and any required backend API keys. 
*(If Supabase keys are left blank, the app gracefully falls back to a fully functional Demo Mode).*

### 3. Install Dependencies
Install dependencies for both the frontend and the backend:
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

## ▶️ How to Run the Project

You can run both the frontend and backend servers simultaneously using a single command from the project root:

```bash
# Starts both frontend (Vite) and backend (Express) concurrently
npm run dev:all
```

Alternatively, you can run them in separate terminals:

**Terminal 1 (Backend Server):**
```bash
cd server
npm run dev
# Server will start on http://localhost:3001
```

**Terminal 2 (Frontend Client):**
```bash
npm run dev
# Client will start on http://localhost:5173
```

Open `http://localhost:5173` in your browser. If you haven't configured Supabase credentials, the app will run in Demo Mode using local storage and mock data.

## 🤖 AI Tools Disclosure
This project utilized AI assistance during development for:
- Structuring boilerplate code and UI components.
- Generating realistic mock agricultural data (seeds, schemes, community posts).
- Drafting documentation templates.
All AI-generated code has been reviewed, understood, and heavily customized by the team to meet specific project requirements and design guidelines.

## 📚 Detailed Documentation
Comprehensive technical documentation is available in the `/docs` directory:
- [01-PRD.md](./docs/01-PRD.md)
- [02-ARCHITECTURE.md](./docs/02-ARCHITECTURE.md)
- [03-DB-SCHEMA.md](./docs/03-DB-SCHEMA.md)
- [04-API-SPECS.md](./docs/04-API-SPECS.md)
- [06-I18N-STRATEGY.md](./docs/06-I18N-STRATEGY.md)
- [15-TESTING-PLAN.md](./docs/15-TESTING-PLAN.md)
- [16-DEPLOYMENT.md](./docs/16-DEPLOYMENT.md)

---
*Built with ❤️ for Indian Agriculture.*
