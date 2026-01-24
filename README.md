# Make The Print

A modern e-commerce platform for custom 3D printed products, built with Next.js, Supabase, and Stripe.

## Status

**This application is currently under active development and is not hosted yet.**

## Features

- **Product Catalog** - Browse and search 3D printed products
- **Custom Letters** - Configure custom wall letters with text, font, color, and size options
- **Shopping Cart** - Add products to cart and manage quantities
- **User Authentication** - Secure sign-up, login, and account management
- **Order Management** - Track orders and view order history
- **Product Reviews** - Leave and read product reviews
- **Wishlist** - Save favorite products for later
- **Stripe Integration** - Secure payment processing
- **Responsive Design** - Optimized for all devices

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Payments:** Stripe
- **Styling:** Tailwind CSS
- **Language:** TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account (for payments)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Alex-Clau/MakeThePrint-Website.git
cd MakeThePrint-Website
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your `.env.local` with:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## License

MIT License
