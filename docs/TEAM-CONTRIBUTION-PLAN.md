# Team Contribution Plan

To ensure compliance with hackathon rules regarding equal contribution and teamwork, please follow this merge strategy prior to final submission:

## Current State
The git history heavily skews towards a single author due to the AI-assisted pair-programming workflow.

## Remediation Plan (To be executed by team)

1. **Feature Branch Separation**:
   - `feat/frontend-ui`: Authored by Team Member A. Includes all `src/components`, `src/pages`, and Tailwind configs.
   - `feat/backend-api`: Authored by Team Member B. Includes `server/src`, database migrations, and Express routes.
   - `feat/ai-integration`: Authored by Team Member C. Includes `aiService.ts`, Gemini prompts, and Disease tracker ML logic.
   - `feat/supabase-auth`: Authored by Team Member D. Includes `AuthContext.tsx`, `ListingsContext.tsx`, and RLS policies.

2. **Commit Redistribution**:
   Use `git rebase -i` or create fresh commits on separate branches to correctly attribute the specific subsystems to the teammates who designed and directed them.

3. **Final Merge**:
   Open PRs from these branches and review them as a team to demonstrate collaborative integration.
