# Community Module

## 1. Purpose
A decentralized, Reddit-style forum for farmers to share knowledge, ask questions about obscure crop diseases, and discuss local agricultural policies.

## 2. Features
- **Feed:** Chronological or Top-voted sorting.
- **Posting:** Support for text and image attachments (stored in Supabase Storage).
- **Upvoting:** Simple reputation system. High-reputation farmers earn a "Krishi Expert" badge.
- **Localization:** Users can filter posts by language.

## 3. Data Flow
- Component fetches from `community_posts` Supabase table.
- Real-time updates utilizing Supabase Realtime subscriptions to show new comments instantly.
