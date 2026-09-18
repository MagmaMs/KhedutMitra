# API Specifications

## 1. External Integrations

### Open-Meteo (Weather)
- **Endpoint:** `GET https://api.open-meteo.com/v1/forecast`
- **Purpose:** Hyperlocal weather forecasts (temp, precipitation, wind).
- **Client implementation:** Managed directly from the frontend via `src/api/weatherApi.ts`.

### AGMARKNET (Market Prices)
- **Endpoint:** Custom scraper or aggregated API via our Express Gateway.
- **Purpose:** Fetching real-time Mandi prices across India.
- **Fallback:** Static JSON dataset mapped in `src/data/mockPrices.json` if the API is rate-limited.

## 2. Express Gateway Endpoints (Internal)

### `POST /api/v1/ai/advisory`
Generates actionable farming advice based on current conditions.
- **Payload:** `{ "crop": "Wheat", "soil_type": "Loamy", "current_weather": "Rainy" }`
- **Response:** `{ "advice": "Delay fertilizer application...", "confidence": 0.89 }`

### `POST /api/v1/ml/disease-detect`
Analyzes uploaded leaf images.
- **Payload:** `multipart/form-data` containing `image`
- **Response:** `{ "disease": "Leaf Rust", "treatment_recommendation": "Use Fungicide X...", "accuracy_score": 0.94 }`

### `GET /api/v1/market/mandi-prices`
Fetches aggregated price data.
- **Query Params:** `state`, `district`, `crop`
- **Response:** Array of `{ "mandi": "Ahmedabad", "min_price": 2000, "max_price": 2400 }`
