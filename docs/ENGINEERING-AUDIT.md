# Engineering Audit - KhedutMitra

## Repository Overview
- **Repository**: KhedutMitra
- **Branch**: main
- **Current Commit**: 890e6d0 (chore(release): final full-system convergence, security patches, testing, and zero-error TS)
- **Status**: Clean working tree

## Architecture Map

### Frontend (React + TypeScript + Vite)
- **Entry**: `src/index.tsx` → `src/App.tsx`
- **Routing**: React Router v6 with role-based guards
- **State Management**: React Context (Auth, Language, Listings, Crop, Demo, Toast)
- **API Layer**: Custom `fetchApi` in `src/api/client.ts`
- **Styling**: Tailwind CSS
- **i18n**: Custom translation system (English, Hindi, Gujarati)
- **Supabase Client**: `src/lib/supabase.ts`

### Backend (Express + TypeScript)
- **Entry**: `server/src/index.ts`
- **Auth Middleware**: `server/src/middleware/auth.ts`
- **Services**: 
  - `weatherService.ts` - Weather API integration
  - `priceService.ts` - AGMARKNET price data
  - `aiService.ts` - Gemini AI integration
- **Database**: Supabase (PostgreSQL) with migrations

### Database Migrations
- `001_initial_schema.sql` - Initial schema
- `002_harden_schema.sql` - Hardened schema with RLS

---

## Files Audited (In Progress)

### Configuration Files
- [ ] `package.json` (root)
- [ ] `package.json` (server)
- [ ] `tsconfig.json` (root)
- [ ] `tsconfig.json` (server)
- [ ] `tsconfig.node.json`
- [ ] `vite.config.ts`
- [ ] `tailwind.config.js`
- [ ] `postcss.config.js`
- [ ] `index.html`

### Frontend Source Files
#### Entry & App
- [ ] `src/index.tsx`
- [ ] `src/App.tsx`
- [ ] `src/index.css`

#### Types
- [ ] `src/types/index.ts`

#### API Layer
- [ ] `src/api/client.ts`
- [ ] `src/api/weather.ts`
- [ ] `src/api/prices.ts`
- [ ] `src/api/features.ts`

#### Lib
- [ ] `src/lib/supabase.ts`

#### Contexts
- [ ] `src/contexts/AuthContext.tsx`
- [ ] `src/contexts/LanguageContext.tsx`
- [ ] `src/contexts/ListingsContext.tsx`
- [ ] `src/contexts/CropContext.tsx`
- [ ] `src/contexts/DemoContext.tsx`
- [ ] `src/contexts/ToastContext.tsx`

#### Hooks
- [ ] `src/hooks/useAuth.ts`
- [ ] `src/hooks/useLanguage.ts`
- [ ] `src/hooks/useTranslation.ts`
- [ ] `src/hooks/useWeather.ts`
- [ ] `src/hooks/useMarketPrices.ts`
- [ ] `src/hooks/useCommunity.ts`
- [ ] `src/hooks/useGeolocation.ts`
- [ ] `src/hooks/useToast.ts`

#### Pages
- [ ] `src/pages/Landing.tsx`
- [ ] `src/pages/Login.tsx`
- [ ] `src/pages/Signup.tsx`
- [ ] `src/pages/Home.tsx` (Farmer Dashboard)
- [ ] `src/pages/Weather.tsx`
- [ ] `src/pages/Prices.tsx`
- [ ] `src/pages/Marketplace.tsx` (Consumer)
- [ ] `src/pages/AgriMarket.tsx` (Farmer)
- [ ] `src/pages/ListingDetail.tsx`
- [ ] `src/pages/Sell.tsx`
- [ ] `src/pages/MyListings.tsx`
- [ ] `src/pages/CropAdvice.tsx`
- [ ] `src/pages/DiseaseTracker.tsx`
- [ ] `src/pages/Schemes.tsx`
- [ ] `src/pages/Community.tsx`
- [ ] `src/pages/CommunityPost.tsx`
- [ ] `src/pages/FarmProfile.tsx`
- [ ] `src/pages/Profile.tsx`
- [ ] `src/pages/SellSuccess.tsx`

#### Components
- [ ] `src/components/Button.tsx`
- [ ] `src/components/Input.tsx`
- [ ] `src/components/Select.tsx`
- [ ] `src/components/Card.tsx`
- [ ] `src/components/LanguageToggle.tsx`
- [ ] `src/components/ErrorState.tsx`
- [ ] `src/components/EmptyState.tsx`
- [ ] `src/components/Skeleton.tsx`
- [ ] `src/components/StatusChip.tsx`
- [ ] `src/components/TrendIndicator.tsx`
- [ ] `src/components/PriceValue.tsx`
- [ ] `src/components/Notice.tsx`
- [ ] `src/components/AppShell.tsx`
- [ ] `src/components/index.ts`
- [ ] `src/components/listings/ListingCard.tsx`
- [ ] `src/components/listings/MyListingRow.tsx`
- [ ] `src/components/prices/PriceTrendChart.tsx`
- [ ] `src/components/prices/MarketRow.tsx`
- [ ] `src/components/prices/BestMarketPanel.tsx`
- [ ] `src/components/dashboard/WeatherCard.tsx`
- [ ] `src/components/dashboard/MarketSnapshot.tsx`
- [ ] `src/components/dashboard/ListingsSummary.tsx`
- [ ] `src/components/dashboard/ForecastStrip.tsx`
- [ ] `src/components/dashboard/AdvisoryCard.tsx`

#### Data
- [ ] `src/data/translations.ts`
- [ ] `src/data/listings.ts`
- [ ] `src/data/products.ts`
- [ ] `src/data/schemes.ts`
- [ ] `src/data/weatherCodes.ts`
- [ ] `src/data/fallbackWeather.ts`
- [ ] `src/data/markets.ts`
- [ ] `src/data/crops.ts`
- [ ] `src/data/locations.ts`
- [ ] `src/data/community.ts`

#### Utils
- [ ] `src/utils/cn.ts`
- [ ] `src/utils/format.ts`
- [ ] `src/utils/advisory.ts`
- [ ] `src/utils/distance.ts`

#### Tests
- [ ] `src/test/setup.ts`
- [ ] `src/test/AuthContext.test.tsx`
- [ ] `src/test/ListingsContext.test.tsx`
- [ ] `src/test/LanguageContext.test.tsx`
- [ ] `src/test/useGeolocation.test.tsx`
- [ ] `src/App.test.tsx`

### Backend Source Files
- [ ] `server/src/index.ts`
- [ ] `server/src/middleware/auth.ts`
- [ ] `server/src/services/weatherService.ts`
- [ ] `server/src/services/priceService.ts`
- [ ] `server/src/services/aiService.ts`
- [ ] `server/src/db/migrations/001_initial_schema.sql`
- [ ] `server/src/db/migrations/002_harden_schema.sql`

---

## Known Issues (To Be Discovered)

### P0 - Critical
- [ ] None found yet

### P1 - Major
- [x] **AuthContext**: Demo mode may conflict with Supabase when both configured - demoUser fallback uses hardcoded phone
- [x] **ListingsContext**: `useAuth` dependency in useEffect but `user` is only used for `ownedByUser` - potential stale closure
- [x] **useWeather**: Uses `any` type with eslint-disable - type safety gap
- [x] **API client**: No request timeout, no AbortController support for cancellation
- [ ] **Error handling**: Multiple `console.error` calls in production code

### P2 - Important
- [x] **Lint errors**: Test files have empty arrow function and non-null assertions
- [x] **Type safety**: Several `as any` casts in test files
- [x] **AgriMarket**: Uses `any[]` for products state, dynamic import without type
- [ ] **useMarketPrices**: No deduplication of concurrent requests for same params
- [ ] **FarmProfile**: Race condition between localStorage and Supabase saves
- [ ] **Community**: No pagination for posts/answers

### P3 - Minor
- [ ] **Hardcoded demo data**: Multiple files have hardcoded demo users/phone numbers
- [ ] **Inconsistent naming**: "buyer" vs "consumer" in some places
- [ ] **Weather codes**: Magic numbers in weatherCodes.ts
- [ ] **DemoContext**: Exposed in Profile page only - should be conditional

### P4 - Optional
- [ ] **Test coverage**: Only 4 test files, limited coverage
- [ ] **Bundle size**: Some large imports (lucide-react, framer-motion)
- [ ] **Accessibility**: Some buttons missing aria-labels 

---

## Fixed Issues
*None yet - audit in progress*

---

## Unresolved Issues
*None yet - audit in progress*

---

## Risk Level
- **Overall**: TBD
- **Security**: TBD
- **Type Safety**: TBD
- **Performance**: TBD
- **Maintainability**: TBD

---

## Test Coverage
- **Unit Tests**: 4 test files
- **Integration Tests**: 0
- **E2E Tests**: 0

---

## Verification State
- [ ] TypeScript build passes
- [ ] Frontend build passes
- [ ] Backend build passes
- [ ] Lint passes
- [ ] Tests pass
- [ ] Dev server starts
- [ ] Browser smoke tests pass

---

## Changed Files
*None yet - audit in progress*

---

## Remaining Work
- [ ] Complete file-by-file inspection
- [ ] Static analysis (TODO, FIXME, console.log, etc.)
- [ ] TypeScript audit
- [ ] React audit (hooks, effects, state)
- [ ] API client audit
- [ ] Backend audit
- [ ] Database/RLS audit
- [ ] Authentication audit
- [ ] Security forensics
- [ ] External API audit
- [ ] AI code audit
- [ ] Image/upload audit
- [ ] State management audit
- [ ] Performance audit
- [ ] Accessibility audit
- [ ] i18n audit
- [ ] Dead code/duplication audit
- [ ] Naming/organization audit
- [ ] Dependency audit
- [ ] Consistency audit
- [ ] Routing audit
- [ ] Form audit
- [ ] Data consistency audit
- [ ] Date/number/unit audit
- [ ] Mobile/responsive audit
- [ ] Test infrastructure review
- [ ] Fix implementation
- [ ] Verification
- [ ] Final report

---

## Architectural Decisions
*To be documented during audit*

---

## Assumptions
*To be documented during audit*

---

## Discovered Edge Cases
*To be documented during audit*