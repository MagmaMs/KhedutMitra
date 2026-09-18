# Government Schemes Directory

## 1. Overview
A persistent issue for Indian agriculture is the lack of awareness regarding government subsidies and schemes (e.g., PM-KISAN, Fasal Bima Yojana).

## 2. Data Structure
Static JSON data (`src/data/schemes.json`) is used for the MVP.
```json
{
  "id": "pm-kisan",
  "title": "Pradhan Mantri Kisan Samman Nidhi",
  "description": "₹6,000 per year minimum income support.",
  "eligibility": "Small and marginal farmers (< 2 hectares).",
  "link": "https://pmkisan.gov.in/"
}
```

## 3. UI Design
- A searchable, filterable list layout.
- Expansion panels for reading detailed eligibility criteria.
- "Apply Now" buttons linking to official government portals.
- Content is fully localized via the i18n module.
