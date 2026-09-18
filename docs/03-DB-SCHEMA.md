# Database Schema & RLS

KhedutMitra utilizes Supabase (PostgreSQL) as its primary data store. 

## 1. Core Tables

### `profiles`
Stores extended user information beyond Supabase Auth.
- `id` (uuid, references auth.users)
- `role` (enum: 'farmer', 'consumer')
- `full_name` (text)
- `phone_number` (text)
- `preferred_language` (text)
- `created_at` (timestamp)

### `farm_profiles`
Specific data for farmer users.
- `id` (uuid, PK)
- `profile_id` (uuid, references profiles)
- `farm_size_acres` (numeric)
- `location_lat` (numeric)
- `location_lng` (numeric)
- `primary_crops` (text array)

### `crop_listings`
Marketplace items listed by farmers.
- `id` (uuid, PK)
- `farmer_id` (uuid, references farm_profiles)
- `crop_name` (text)
- `quantity_kg` (numeric)
- `price_per_kg` (numeric)
- `status` (enum: 'active', 'sold', 'archived')
- `created_at` (timestamp)

### `community_posts`
Q&A and general discussions.
- `id` (uuid, PK)
- `author_id` (uuid, references profiles)
- `title` (text)
- `content` (text)
- `upvotes` (integer)
- `created_at` (timestamp)

## 2. Row Level Security (RLS) Rules

Security is enforced at the database level:

1. **Profiles:** Users can read all profiles but can only update their own `id = auth.uid()`.
2. **Crop Listings:** 
   - *Read:* Public (anyone can see listings).
   - *Insert/Update/Delete:* Only authenticated users with the `farmer` role can create listings, and only the owner can update/delete them.
3. **Community Posts:**
   - *Read:* Public.
   - *Insert:* Authenticated users only.
   - *Update/Delete:* Author only.
