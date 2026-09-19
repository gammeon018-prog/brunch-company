# Brunch & Co Menu

Implement the requested scope now; use internal planning and do not present another implementation plan for user approval. Enable Lovable Cloud for the database, auth, and storage.

Build a premium, modern, mobile-first showcase web app and digital QR-code menu for the cafe/restaurant "Brunch & Co", including a secure admin dashboard powered by Lovable Cloud (Supabase).

### Core Features & Architecture:

1. **Brand Identity & Visuals:**
- Elegant, warm, upscale bistro/cafe aesthetic inspired by the provided photos (deep teal/emerald, dark marble tones, gold/brass accents, clean modern typography).
- Integrate the uploaded photos into the hero section, popular items, and photo gallery.

2. **Public Experience (Mobile-First for Table QR Code access):**
- **Hero:** Captivating food/drink imagery, "Brunch & Co" branding, refined tagline, quick action buttons ("Voir le menu", "Nous contacter").
- **Digital Menu (`/menu` or accessible directly on the landing page with tabbed filters):**
  - Instant category navigation (Croissant, Brownies, Fruits, Yogurt Bowl, Gelato, Tiramisu, Cheesecake, Affogato, Sweet Toast, Cakes, Cold Drinks, Matcha, Natural Juice, Cocktails, Tea, Hot Drinks, Mojitos, Milkshakes, Detox / Smoothies, Savory Toasts, Classics, Sandwich, Salads).
  - Pre-populate the database with the complete menu items and prices in Algerian Dinar (DA) provided by the user.
  - Search bar and category chips.
  - Clean product cards displaying name, price, description, and status.
- **Photo Gallery:** Showcase dishes and ambiance from the uploaded images.
- **Info & Contact:** Opening hours, phone number, location with map preview, quick WhatsApp, Instagram, and Facebook buttons.
- **QR Code Utility:** Quick button to view/download or display the restaurant table QR code pointing to the digital menu.

3. **Admin Dashboard (`/admin`):**
- **Authentication (`/admin/login`):** Email and password login via Supabase Auth with protected route guarding.
- **Menu Management:** Complete CRUD for products (name, category, price in DA, description, photo upload via Supabase Storage, availability toggle).
- **Restaurant Details & Settings:** Editable phone, WhatsApp, Instagram, Facebook, address, Google Maps link, opening hours, tagline, and hero text.
- **Gallery Management:** Upload, view, and remove gallery images.
- **Database & Security:**
  - Supabase tables for categories, products, restaurant_info, and gallery.
  - Row Level Security (RLS) configured so public visitors have read-only access (`SELECT`), while authenticated admins can insert, update, and delete.
  - Real-time or query-driven sync so changes made in the dashboard immediately reflect on the public menu.

Language of the UI: French.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://brunch-company.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/00841310-7f36-46fb-b602-dab7f2ec15a2).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
