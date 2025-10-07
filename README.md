# Mobile Store – Next.js 15 (App Router)

A full‑stack demo e‑commerce app for smartphones. Features product browsing with search and filters, cart with client persistence, Stripe Checkout, a demo checkout flow, admin product management with image uploads, and authentication for users and admins.

## Tech Stack
- **Framework**: Next.js 15 (App Router, server components, middleware)
- **Language**: TypeScript, React 19
- **Styling**: Tailwind CSS 4
- **Database (catalog)**: PostgreSQL via Prisma ORM
- **Auth DB**: MongoDB (users/admins for credentials and demo transactions)
- **Auth**: NextAuth (JWT sessions) with Credentials providers (user/admin)
- **Payments**: Stripe Checkout
- **Storage/Media**: Cloudinary signed uploads (client uploads + server signature)
- **Carousel/UI**: Embla Carousel
- **Validation**: Zod (where applicable in code)

## Features
- **Product catalog**: Categories, product details, images, price (cents), stock, reviews
- **Browse & filter**: Search query, category filter, price min/max, pagination
- **Product page**: Gallery, details, reviews, add‑to‑cart with quantity
- **Shopping cart**: Client‑side cart persisted in localStorage; quantity management; remove/clear
- **Checkout**:
  - Stripe Checkout session creation and redirect
  - Demo checkout route to simulate payment and record a transaction in MongoDB
- **User auth**: Sign up (MongoDB), Sign in (NextAuth credentials), protected pages via middleware
- **Admin**:
  - Sign in via secret (cookie) or NextAuth admin role
  - Products CRUD (create/update/delete) via admin API
  - Image uploads using Cloudinary signed requests
- **Security**:
  - Middleware route protection for `/admin`, `/products`, `/cart`, `/success`, `/users/transactions`, and dynamic `/[user_id]/transactions`
  - Admin API authorization via `ADMIN_SECRET` cookie

## Project Structure (high level)
- `src/app` – App Router pages and API routes
  - `page.tsx` – Landing + hero carousel
  - `products/` – Listing, filters, details page with `AddToCartButton`
  - `cart/` – Cart page with Stripe and demo checkout buttons
  - `success/` – Post‑checkout success page
  - `(auth)/user` – Sign in / Sign up pages
  - `(auth)/admin` – Admin sign in page
  - `admin/` – Admin product list, new/edit forms
  - `api/` – REST endpoints (see API section)
- `src/components` – UI components (navbar, hero carousel, uploader, etc.)
- `src/context/CartContext.tsx` – Cart state, persistence, helpers
- `src/lib` – Integrations: Prisma, Mongo, Stripe, NextAuth options, auth helpers
- `prisma/` – Prisma schema, migrations, seed script

## Data Model (Prisma/Postgres)
- `User`: id, email, name, role (ADMIN|CUSTOMER), passwordHash, timestamps
- `Category`: id, name, slug (unique)
- `Product`: id, title, slug (unique), description, price (cents), stock, images (JSON of URLs), `categoryId`, timestamps; relations to `Category`, `Review`, `OrderItem`
- `Review`: id, productId, rating, author, comment, createdAt
- `Order`: id, email, name, amount (cents), currency, stripeSessionId, createdAt; items
- `OrderItem`: id, orderId, productId, quantity, unitPrice (cents)

MongoDB collections used by app code:
- `users` (auth for customers)
- `admins` (auth for admins)
- `transactions` (demo checkout writes)

## API Routes
- Public catalog
  - `GET /api/products` – list with filters `?q=&category=&min=&max=&page=&pageSize=`
  - `GET /api/products/[slug]` – product details incl. reviews
- Auth
  - `POST /api/users/signup` – create user in MongoDB
  - `GET|POST /api/auth/[...nextauth]` – NextAuth handler (credentials providers)
- Checkout
  - `POST /api/checkout` – create Stripe Checkout session
  - `POST /api/demo-checkout` – simulate checkout and record transaction (MongoDB)
- Uploads
  - `POST /api/upload/sign` – returns Cloudinary signature for client uploads
- Admin
  - `POST /api/admin/login` – sets `admin` cookie when body.secret matches `ADMIN_SECRET`
  - `POST /api/admin/products` – create product (requires admin cookie)
  - `PATCH /api/admin/products/[id]` – update product (requires admin cookie)
  - `DELETE /api/admin/products/[id]` – delete product (requires admin cookie)

## Middleware Protection
- Implemented in `src/middleware.ts` (matcher `/:path*`)
- Public: `/`, `/api`, `/_next`, `/favicon.ico`, `/user/signin`, `/user/signup`, `/admin/signin`
- Admin: `/admin/**` requires NextAuth token with `role === "admin"`
- User pages require a valid session: `/products/**`, `/cart`, `/success`, `/users/transactions`
- Dynamic transactions route `/[user_id]/transactions` requires `token.userId === [user_id]`

## Environment Variables
Create `.env` with the following (example names; adjust for your environment):

```bash
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# Databases
DATABASE_URL=postgresql://user:pass@localhost:5432/mobile_store
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=mobile_store

# Admin
ADMIN_SECRET=super_secret_cookie_value

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456
CLOUDINARY_API_SECRET=abc123
```

## Setup & Development
1. Install dependencies
   ```bash
   npm install
   ```
2. Generate Prisma client and run migrations
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```
3. Seed database (categories, sample products, admin user in Postgres `User` table)
   ```bash
   npm run db:seed
   ```
4. Start the dev server
   ```bash
   npm run dev
   ```

Open `http://localhost:3000`.

## Seeding Notes
- Creates categories: Android, iOS, Feature Phones
- Inserts sample products with Cloudinary demo images
- Upserts an admin user in Postgres `User` table with role `ADMIN` (credentials shown in seed logs). Admin access for UI/API is controlled either by this role via NextAuth middleware or by `ADMIN_SECRET` cookie depending on the route.

## Using the App
- Browse products at `/products` (requires sign‑in per middleware)
- View product details and add to cart
- Manage cart at `/cart`, then:
  - Stripe Checkout: real redirect to Stripe (needs valid Stripe keys)
  - Demo Pay: writes a transaction to Mongo and navigates to `/success`
- Admin area at `/admin`:
  - Login via `/api/admin/login` with `ADMIN_SECRET` to set cookie
  - Create/Edit/Delete products; upload images via signed Cloudinary uploads

## Image Uploads
- Client uses `ImageUploader` which requests a signature from `POST /api/upload/sign`
- Use returned `timestamp`, `signature`, `apiKey`, `cloudName` to upload directly to Cloudinary from the browser

## Important Considerations
- Prices are stored in cents (integers) to avoid floating point errors
- Mixed persistence for demo: Postgres (catalog) + MongoDB (auth/demo orders)
- Middleware protects routes and enforces user ownership on `/:user_id/transactions`
- Admin APIs rely on an `ADMIN_SECRET` cookie; keep this value private

## Scripts
- `npm run dev` – start Next.js dev server (Turbopack)
- `npm run build` – production build
- `npm run start` – start production server
- `npm run prisma:generate` – generate Prisma client
- `npm run prisma:migrate` – run dev migration
- `npm run prisma:studio` – open Prisma Studio
- `npm run db:seed` – seed initial data

## License
This project is for demo/educational purposes. Replace secrets, validate inputs, and harden auth before production use.
