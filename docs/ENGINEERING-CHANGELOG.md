## Engineering Changelog - KhedutMitra Audit

## Format
Each entry: `[DATE] [SEVERITY] [FILE] - Description of change`

---

## Audit Changes

- [2026-09-19] [P3] src/test/AuthContext.test.tsx - Fixed empty arrow function lint error (line 31)
- [2026-09-19] [P2] src/test/AuthContext.test.tsx, src/test/ListingsContext.test.tsx - Fixed non-null assertion warnings by using local mock constants
- [2026-09-19] [P1] src/hooks/useWeather.ts - Removed `any` type and eslint-disable, added proper OpenMeteoResponse interface
- [2026-09-19] [P1] src/api/client.ts - Added request timeout (15s default) and AbortController support for request cancellation
- [2026-09-19] [P2] src/pages/AgriMarket.tsx - Removed `any[]` type for products, added proper AgriProduct type, removed dynamic import, fixed category handling
- [2026-09-19] [P1] src/contexts/ListingsContext.tsx - Fixed stale closure issue by computing ownedByUser as derived state via useMemo, added farmerId to Listing type and seed data
- [2026-09-19] [P1] src/types/index.ts - Added farmerId field to Listing interface
- [2026-09-19] [P1] src/data/listings.ts - Added farmerId to all seed listings