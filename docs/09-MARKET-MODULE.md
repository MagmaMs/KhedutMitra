# Market Module & Pricing

## 1. Overview
The Market Module serves two functions:
1. Providing farmers with current Mandi prices to negotiate better.
2. Allowing direct Farmer-to-Consumer crop listings.

## 2. AGMARKNET Integration
AGMARKNET is the government portal for agricultural prices. 

### Data Ingestion
- Due to lack of a clean public API, we implement a periodic scraping script on our Express backend (or use a secondary proxy API) to fetch prices for key crops (Wheat, Rice, Cotton).
- Caching: Prices are cached in Redis (or in-memory for the MVP) for 12 hours to prevent aggressive scraping.

## 3. Direct Marketplace
- Farmers create `crop_listings` indicating Crop, Quantity (kg), and Expected Price (₹/kg).
- Consumers browse listings, filtered by proximity (using PostGIS in Supabase if time permits, or simple state-level filtering).
- **Communication:** Consumers can click "Contact Farmer" to reveal the farmer's phone number or trigger a WhatsApp intent.
