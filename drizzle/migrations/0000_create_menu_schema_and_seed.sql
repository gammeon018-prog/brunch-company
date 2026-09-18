-- CATEGORIES
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  group_label text NOT NULL DEFAULT 'Autres',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories_public_read" ON public.categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "categories_admin_insert" ON public.categories FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "categories_admin_update" ON public.categories FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL);
CREATE POLICY "categories_admin_delete" ON public.categories FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- PRODUCTS
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price_da int NOT NULL DEFAULT 0,
  image_url text,
  is_available boolean NOT NULL DEFAULT true,
  is_popular boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX products_category_idx ON public.products(category_id);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_public_read" ON public.products FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "products_admin_insert" ON public.products FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "products_admin_update" ON public.products FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL);
CREATE POLICY "products_admin_delete" ON public.products FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- RESTAURANT INFO (single row)
CREATE TABLE public.restaurant_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'Brunch & Co',
  tagline text,
  hero_title text,
  hero_subtitle text,
  about_text text,
  phone text,
  whatsapp text,
  instagram text,
  facebook text,
  address text,
  maps_link text,
  maps_embed text,
  opening_hours text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.restaurant_info TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.restaurant_info TO authenticated;
GRANT ALL ON public.restaurant_info TO service_role;
ALTER TABLE public.restaurant_info ENABLE ROW LEVEL SECURITY;
CREATE POLICY "info_public_read" ON public.restaurant_info FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "info_admin_insert" ON public.restaurant_info FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "info_admin_update" ON public.restaurant_info FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL);
CREATE POLICY "info_admin_delete" ON public.restaurant_info FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- GALLERY
CREATE TABLE public.gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  caption text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery TO authenticated;
GRANT ALL ON public.gallery TO service_role;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gallery_public_read" ON public.gallery FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "gallery_admin_insert" ON public.gallery FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "gallery_admin_update" ON public.gallery FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL);
CREATE POLICY "gallery_admin_delete" ON public.gallery FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- SEED CATEGORIES
INSERT INTO public.categories (slug, name, group_label, sort_order) VALUES
('savory-toasts','Savory Toasts','Salé',1),
('croissants-sales','Croissants','Salé',2),
('classics','Classics','Salé',3),
('sandwich','Sandwich','Salé',4),
('salads','Salads','Salé',5),
('croissants-sucres','Croissant','Sucré',10),
('brownies','Brownies','Sucré',11),
('tiramisu','Tiramisu','Sucré',12),
('cheesecake','Cheese-Cake','Sucré',13),
('affogato','Affogato','Sucré',14),
('sweet-toast','Sweet Toast','Sucré',15),
('cakes','Cakes','Sucré',16),
('yogurt-bowl','Yogurt Bowl','Sucré',17),
('fruits','Fruits','Sucré',18),
('gelato','Gelato','Sucré',19),
('hot-drinks','Hot Drinks','Boissons',30),
('cold-drinks','Cold Drinks','Boissons',31),
('matcha','Matcha','Boissons',32),
('natural-juice','Natural Juice','Boissons',33),
('detox-smoothies','Detox / Smoothies','Boissons',34),
('milkshakes','Milkshakes','Boissons',35),
('mojitos','Mojitos','Boissons',36),
('cocktails','Cocktails','Boissons',37),
('tea','Tea','Boissons',38);

-- SEED PRODUCTS
INSERT INTO public.products (category_id, name, description, price_da, sort_order, is_popular)
SELECT c.id, v.name, v.descr, v.price, v.ord, v.pop
FROM (VALUES
-- Savory toasts
('savory-toasts','Morning Toast','Œuf, Fromage blanc, Salade, Fruits',350,1,false),
('savory-toasts','Tuna Toast','Thon, Fromage, Salade, Fruits',450,2,false),
('savory-toasts','Tomato Toast','Tomate cerise, Sauce pesto, Fromage, Salade, Fruits',600,3,true),
('savory-toasts','Eggplant Toast','Aubergine, Viande hachée, Cheddar, Salade, Fruits',650,4,false),
('savory-toasts','Cheeses Toast','Cheddar, Mozzarella, Fromage blanc, (Fromage rouge/Gruyère/Camembert), Salade, Fruits',650,5,false),
('savory-toasts','Spinach Toast','Épinards à la crème, Poulet, Fromage, Salade, Fruits',700,6,true),
('savory-toasts','Mushroom Toast','Champignons, Fromage, Salade, Fruits',750,7,false),
('savory-toasts','Avocado Toast','Avocat, Fromage, Salade, Fruits',1100,8,false),
('savory-toasts','Crevette Toast','Crevette, Crème avocat, Salade, Fruits',1300,9,false),
('savory-toasts','Salmon Toast','Saumon Fumé, Fromage, Salade, Sauce pesto, Fruits',1400,10,true),
-- Croissants salés
('croissants-sales','Croissant Sunrise','Œuf, Fromage, Salade, Fruits',400,1,false),
('croissants-sales','Croissant Smoked Chicken','Poulet Fumé, Fromage, Salade, Fruits',550,2,false),
('croissants-sales','Croissant Cheeses','Cheddar, Mozzarella, Fromage blanc, (Fromage rouge/Gruyère/Camembert), Salade, Fruits',650,3,false),
('croissants-sales','Croissant Avocado','Avocat, Fromage, Salade, Fruits',1000,4,false),
('croissants-sales','Croissant Crevette','Crevette, Crème avocat, Salade, Fruits',1100,5,false),
('croissants-sales','Croissant Salmon','Saumon Fumé, Fromage, Salade, Sauce pesto, Fruits',1200,6,false),
('croissants-sales','Croissant Brunch & Co','Avocat, Saumon Fumé, Fromage, Légumes sautés, Salade, Fruits',1600,7,true),
-- Classics
('classics','Classic Brunch','Pain grillé, Œuf, Salade, Tomate, Concombre, Persil, Noix, Confiture au choix, Fruits',600,1,false),
('classics','Cheeses Brunch','Pain grillé, 3 fromages, Salade, Tomate, Concombre, Persil, Confiture au choix, Fruits',650,2,false),
('classics','Mushroom Brunch','Pain grillé, Champignons, Salade, Tomate, Concombre, Persil, Épinards, Noix, Fruits',800,3,false),
('classics','Avocado Brunch','Pain grillé, Avocat, Salade, Maïs, Tomate, Concombre, Persil, Noix, Fruits',1200,4,false),
('classics','Salmon Brunch','Pain grillé, Saumon fumé, Sauce pesto, Salade, Tomate, Concombre, Persil, Noix, Fruits',1500,5,false),
('classics','Brunch & Co','Pain grillé, Fromage, Avocat, Saumon fumé, Salade, Tomate, Concombre, Persil, Noix, Fruits',1800,6,true),
-- Sandwich
('sandwich','Thon','Thon, Fromage, Salade',450,1,false),
('sandwich','Smoked Chicken','Poulet Fumé, Oignon caramélisé, Salade',550,2,false),
('sandwich','Cheeses','Cheddar, Mozzarella, Fromage blanc, (Fromage rouge/Gruyère), Salade',650,3,false),
('sandwich','Brunch & Co','Poulet Fumé, Sauce pesto, 3 Fromages, Salade, Fruits',850,4,false),
-- Salads
('salads','Greek','Salade verte, Tomate, Poivron, Concombre, Oignon, Olive, Fromage',400,1,false),
('salads','Cesar','Salade verte, Crouton, Poulet, Œuf, Cheddar, Crème césar',450,2,false),
('salads','Niçoise','Salade verte, Thon, Tomate, Pomme de terre, Olives, Maïs, Œuf',500,3,false),
('salads','Pasta Salad','Pâtes, Tomate, Concombre, Maïs, Avocat, Cheddar, Sauce pesto',750,4,false),
('salads','Salmon','Salade verte, Saumon fumée, Avocat, Œuf, Oignon, Pistache, Sauce soja',850,5,false),
('salads','Salade composée au choix','Composez votre salade selon vos envies',0,6,false),
-- Croissant sucré
('croissants-sucres','Croissant Simple',NULL,100,1,false),
('croissants-sucres','Croissant au Chocolat',NULL,400,2,false),
('croissants-sucres','Croissant Banane',NULL,500,3,false),
('croissants-sucres','Croissant Fraise',NULL,600,4,false),
('croissants-sucres','Croissant Mangue',NULL,650,5,false),
('croissants-sucres','Croissant Pistache',NULL,700,6,true),
-- Brownies
('brownies','Brownie Simple',NULL,300,1,false),
('brownies','Brownie Chocolat',NULL,350,2,false),
('brownies','Brownie Caramel Beurre Salé',NULL,450,3,true),
('brownies','Brownie Chocolat Noir',NULL,450,4,false),
('brownies','Brownie Pistache',NULL,500,5,false),
-- Tiramisu
('tiramisu','Tiramisu Simple',NULL,450,1,false),
('tiramisu','Tiramisu au Chocolat',NULL,550,2,false),
('tiramisu','Tiramisu Fruit',NULL,550,3,false),
('tiramisu','Tiramisu Bueno',NULL,650,4,false),
('tiramisu','Tiramisu Lotus',NULL,650,5,false),
('tiramisu','Tiramisu Pistache',NULL,650,6,true),
-- Cheesecake
('cheesecake','Cheesecake Chocolat',NULL,500,1,false),
('cheesecake','Cheesecake Fraise',NULL,550,2,false),
('cheesecake','Cheesecake Mangue',NULL,600,3,false),
('cheesecake','Cheesecake Bueno',NULL,650,4,false),
('cheesecake','Cheesecake Ferrero',NULL,650,5,true),
('cheesecake','Cheesecake Lotus',NULL,700,6,false),
('cheesecake','Cheesecake Pistache',NULL,700,7,false),
-- Affogato
('affogato','Affogato Chocolat',NULL,500,1,false),
('affogato','Affogato Vanille',NULL,500,2,false),
('affogato','Affogato Caramel Beurre Salé',NULL,600,3,false),
('affogato','Affogato Pistache',NULL,700,4,false),
-- Sweet toast
('sweet-toast','Toast Chocolat',NULL,350,1,false),
('sweet-toast','Toast Pêche',NULL,400,2,false),
('sweet-toast','Toast Banane',NULL,400,3,false),
-- Cakes
('cakes','Healthy Cake',NULL,350,1,false),
('cakes','Energy Cake',NULL,400,2,false),
('cakes','Tarte aux Pommes',NULL,400,3,false),
('cakes','Trompe l''Oeil',NULL,600,4,false),
-- Yogurt bowl
('yogurt-bowl','Classic','Fraise, Granola, Datte',650,1,false),
('yogurt-bowl','Apple Cinnamon','Pomme, Flocons d''avoine, Cannelle, Miel',700,2,false),
('yogurt-bowl','Sunrise','Banane, Mangue, Noix',800,3,false),
-- Fruits
('fruits','Fruits Salad',NULL,400,1,false),
('fruits','Single Mix Fruits',NULL,650,2,false),
('fruits','Double Mix Fruits',NULL,1000,3,false),
('fruits','Extra Mix Fruits',NULL,1500,4,false),
-- Gelato
('gelato','1 Boule',NULL,300,1,false),
-- Hot drinks
('hot-drinks','Espresso (emporté)',NULL,50,1,false),
('hot-drinks','Espresso',NULL,100,2,false),
('hot-drinks','Lait',NULL,100,3,false),
('hot-drinks','Café au Lait',NULL,150,4,false),
('hot-drinks','Caps',NULL,150,5,false),
('hot-drinks','Double Espresso',NULL,200,6,false),
('hot-drinks','L''Or',NULL,200,7,false),
('hot-drinks','Dolce Gusto (Nescafé)',NULL,300,8,false),
('hot-drinks','Lavazza',NULL,300,9,false),
('hot-drinks','Carte Noir',NULL,300,10,false),
('hot-drinks','Chocolat Chaud',NULL,300,11,false),
('hot-drinks','Cappuccino Classic',NULL,400,12,true),
('hot-drinks','Caffe Latte',NULL,400,13,false),
-- Cold drinks
('cold-drinks','Ice Coffee',NULL,400,1,false),
('cold-drinks','Ice Latte',NULL,450,2,false),
('cold-drinks','Orange Ice Americano',NULL,450,3,false),
('cold-drinks','Ice Caramel Latte',NULL,500,4,false),
('cold-drinks','Ice Mocha',NULL,500,5,false),
('cold-drinks','Vanilla Iced Latte',NULL,550,6,false),
('cold-drinks','Americano Peach Cream',NULL,600,7,false),
('cold-drinks','Spanish Latte',NULL,600,8,true),
('cold-drinks','Ice Mocha Strawberry',NULL,650,9,false),
('cold-drinks','Tiramisu Iced Coffee',NULL,650,10,true),
('cold-drinks','Ice Mocha Pistachio',NULL,750,11,false),
-- Matcha
('matcha','Matcha Classique','Chaud ou froid',500,1,false),
('matcha','Matcha Caramel','Chaud ou froid',600,2,false),
('matcha','Matcha Strawberry','Chaud ou froid',650,3,false),
('matcha','Matcha Mangue','Chaud ou froid',650,4,false),
-- Natural juice
('natural-juice','Orange',NULL,400,1,false),
('natural-juice','Citron',NULL,500,2,false),
('natural-juice','Banane',NULL,550,3,false),
('natural-juice','Fraise',NULL,600,4,false),
('natural-juice','Ananas',NULL,650,5,false),
('natural-juice','Cocktail',NULL,700,6,true),
('natural-juice','Mangue',NULL,900,7,false),
-- Detox
('detox-smoothies','Ginger Detox','Carotte, Orange, Gingembre, Curcuma',500,1,false),
('detox-smoothies','Green Detox','Céleri, Concombre, Citron, Gingembre',550,2,false),
('detox-smoothies','Easy Detox','Betteraves, Carotte, Citron, Concombre',600,3,false),
('detox-smoothies','Glow Detox','Carotte, Pomme, Orange, Gingembre',600,4,false),
('detox-smoothies','Power Smoothie','Datte, Banane, Cacao, Noix, Lait',650,5,false),
('detox-smoothies','Honey Smoothie','Banane, Noix, Miel, Lait',750,6,false),
-- Milkshakes
('milkshakes','Milkshake Banane',NULL,500,1,false),
('milkshakes','Milkshake Chocolat',NULL,600,2,false),
('milkshakes','Milkshake Strawberry',NULL,650,3,false),
('milkshakes','Milkshake Nutella',NULL,750,4,false),
('milkshakes','Milkshake Lotus',NULL,750,5,false),
-- Mojitos
('mojitos','Mojito Classic',NULL,400,1,true),
('mojitos','Mojito Juice',NULL,500,2,false),
('mojitos','Red Mojito',NULL,500,3,false),
('mojitos','Blue Mojito',NULL,500,4,true),
('mojitos','Creamy Mojito',NULL,600,5,false),
-- Cocktails
('cocktails','Bora Bora',NULL,500,1,false),
('cocktails','Blue Hawaii',NULL,500,2,false),
('cocktails','Pina Collada',NULL,500,3,false),
('cocktails','Pink Lady',NULL,600,4,false),
-- Tea
('tea','Thé Maison',NULL,150,1,false),
('tea','Lipton',NULL,150,2,false),
('tea','Ice Tea',NULL,400,3,false),
('tea','Menu Thé','Fusion / Thé vert, Fruits secs',400,4,false)
) AS v(cat, name, descr, price, ord, pop)
JOIN public.categories c ON c.slug = v.cat;

-- SEED RESTAURANT INFO
INSERT INTO public.restaurant_info (name, tagline, hero_title, hero_subtitle, about_text, phone, whatsapp, instagram, facebook, address, maps_link, opening_hours)
VALUES (
  'Brunch & Co',
  'Brunch, café de spécialité & pâtisseries maison',
  'Brunch & Co',
  'Une cuisine généreuse, des produits frais et un café de caractère — du matin jusqu''au dessert.',
  'Brunch & Co est une maison de brunch où chaque assiette est préparée le jour même : toasts gourmands, croissants garnis, salades fraîches, pâtisseries et café de spécialité.',
  '',
  '',
  '',
  '',
  '',
  '',
  E'Dimanche - Jeudi : 08:00 - 22:00\nVendredi : 14:00 - 23:00\nSamedi : 08:00 - 23:00'
);