ALTER TABLE public.restaurant_info
  ADD COLUMN website text;

UPDATE public.restaurant_info
SET website = 'https://brunch-company.lovable.app'
WHERE website IS NULL;
