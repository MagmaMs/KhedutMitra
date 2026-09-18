# Weather Module Integration

## 1. Provider
We use the **Open-Meteo API** as it requires no API key, provides hourly/daily forecasts, and has excellent global coverage, making it ideal for a hackathon MVP.

## 2. Implementation Strategy

### 2.1 Location Acquisition
- Try to acquire the user's GPS coordinates via the Browser Geolocation API.
- Fallback: Use the `location_lat` and `location_lng` saved in their `farm_profiles`.
- Fallback 2: Default to a central geographic point in India (e.g., Nagpur).

### 2.2 Data Fetched
- Current temperature, humidity, and wind speed.
- 7-day precipitation forecast (critical for sowing/harvesting decisions).
- Severe weather alerts (if available via Open-Meteo integrations).

## 3. UI Representation
- Highlighted on the Farmer Dashboard.
- Visual indicators (TrendIndicator component) for rising temperatures or incoming rain.
