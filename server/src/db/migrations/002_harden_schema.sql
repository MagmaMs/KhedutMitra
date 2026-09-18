-- Add numeric constraints to prevent impossible states
ALTER TABLE public.crop_listings ADD CONSTRAINT price_positive CHECK (price_per_kg > 0);
ALTER TABLE public.crop_listings ADD CONSTRAINT quantity_positive CHECK (quantity_kg > 0);
