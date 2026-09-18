# Testing Plan

## 1. Strategy Overview
Due to hackathon time constraints, testing prioritizes critical paths (Auth, Market creation, i18n rendering) over 100% coverage.

## 2. Unit & Component Testing
- **Framework:** Vitest + React Testing Library.
- **Focus:**
  - `LanguageContext`: Ensures translations switch correctly.
  - UI Components: Check rendering of `Button`, `Card` without crashing.

## 3. Integration Testing
- **Focus:** API hook responses.
- Mocking: MSW (Mock Service Worker) used to stub Open-Meteo and Supabase responses during tests.

## 4. E2E Testing (Stretch Goal)
- **Framework:** Playwright or Cypress.
- **Critical Flow:**
  1. Login as Farmer.
  2. Navigate to Market.
  3. Create a new crop listing.
  4. Logout.
  5. Login as Consumer.
  6. Verify the listing appears.
