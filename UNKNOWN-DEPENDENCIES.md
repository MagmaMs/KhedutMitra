# Unknown Dependencies / Third-Party Libraries

This document outlines third-party libraries and tools planned for use in KhedutMitra, ensuring all dependencies are tracked for the hackathon environment.

## Frontend
- **react-router-dom:** Routing.
- **lucide-react:** Consistent, clean iconography.
- **framer-motion:** Subtle UI animations and page transitions.
- **react-query (TanStack Query):** Server state management and caching.
- **axios:** HTTP client for external API requests.
- **clsx / tailwind-merge:** For dynamic Tailwind class utility management (crucial for Magic Patterns components).

## Backend (Express)
- **express & cors:** Server foundation.
- **multer:** For handling `multipart/form-data` (image uploads for the disease tracker).
- **openai / @anthropic-ai/sdk:** SDKs for the AI Advisory module.

## External Services
- **Supabase (BaaS):** PostgreSQL, Auth, Edge Functions.
- **Open-Meteo API:** Weather data (No API key required).
- **Plant.id / HuggingFace Inference API:** ML model endpoints for crop disease detection.
