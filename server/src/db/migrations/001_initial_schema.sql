-- 001_initial_schema.sql
-- Run this in the Supabase SQL editor to initialize the KhedutMitra database

-- 1. Profiles (extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('farmer', 'buyer')),
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Farm Profiles (1:1 with profiles for farmers)
CREATE TABLE public.farm_profiles (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  soil_type TEXT,
  current_crop TEXT,
  budget TEXT,
  previous_crop TEXT,
  irrigation_available BOOLEAN DEFAULT false,
  completed BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Agri Products (Marketplace Catalog)
CREATE TABLE public.agri_products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  brand TEXT,
  vendor TEXT,
  price NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  rating NUMERIC,
  rating_count INTEGER DEFAULT 0,
  availability BOOLEAN DEFAULT true,
  location TEXT,
  source_type TEXT NOT NULL DEFAULT 'live',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Government Schemes
CREATE TABLE public.government_schemes (
  id TEXT PRIMARY KEY,
  title JSONB NOT NULL, -- { en: '', hi: '', gu: '' }
  description JSONB NOT NULL,
  category TEXT NOT NULL,
  official_url TEXT NOT NULL,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Community Posts
CREATE TABLE public.community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  author_location TEXT,
  is_expert BOOLEAN DEFAULT false,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  crop TEXT,
  category TEXT,
  answer_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Community Answers
CREATE TABLE public.community_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  author_location TEXT,
  is_expert BOOLEAN DEFAULT false,
  body TEXT NOT NULL,
  is_accepted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Crop Listings
CREATE TABLE public.crop_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  crop_id TEXT NOT NULL,
  quantity_kg NUMERIC NOT NULL,
  price_per_kg NUMERIC NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'sold', 'withdrawn')),
  farmer_name TEXT NOT NULL,
  farmer_phone TEXT NOT NULL,
  village TEXT NOT NULL,
  district TEXT NOT NULL,
  state TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- Row Level Security (RLS) Setup
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agri_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.government_schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_listings ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: readable by all, updatable by self
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Farm Profiles: readable/updatable by self
CREATE POLICY "Users can view own farm profile." ON public.farm_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own farm profile." ON public.farm_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own farm profile." ON public.farm_profiles FOR UPDATE USING (auth.uid() = id);

-- Agri Products: readable by all
CREATE POLICY "Products are viewable by everyone." ON public.agri_products FOR SELECT USING (true);

-- Government Schemes: readable by all
CREATE POLICY "Schemes are viewable by everyone." ON public.government_schemes FOR SELECT USING (true);

-- Community Posts: readable by all, insertable by authenticated users
CREATE POLICY "Posts are viewable by everyone." ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert posts." ON public.community_posts FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Community Answers: readable by all, insertable by authenticated users
CREATE POLICY "Answers are viewable by everyone." ON public.community_answers FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert answers." ON public.community_answers FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Crop Listings: readable by all, updatable by owner
CREATE POLICY "Listings are viewable by everyone." ON public.crop_listings FOR SELECT USING (true);
CREATE POLICY "Users can insert own listings." ON public.crop_listings FOR INSERT WITH CHECK (auth.uid() = farmer_id);
CREATE POLICY "Users can update own listings." ON public.crop_listings FOR UPDATE USING (auth.uid() = farmer_id);
CREATE POLICY "Users can delete own listings." ON public.crop_listings FOR DELETE USING (auth.uid() = farmer_id);

-- Setup Trigger to create a profile automatically on auth.users INSERT
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, phone, role, state, district)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'phone',
    COALESCE(new.raw_user_meta_data->>'role', 'farmer'),
    new.raw_user_meta_data->>'state',
    new.raw_user_meta_data->>'district'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
