# LIFE Services

**Get your LIFE back.**

Premium property maintenance subscription platform — lawn mowing, pest control, pressure washing, gutter cleaning & more. Based in Banyo, Brisbane.

---

## Project Structure

```
lifeservices/
├── frontend/          # Next.js 14 (App Router, React, Tailwind CSS)
├── backend/           # Node.js + Express REST API
│   └── prisma/        # Prisma ORM + PostgreSQL schema
└── README.md
```

## Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | Next.js 14, React 18, Tailwind CSS      |
| Backend    | Node.js, Express, TypeScript            |
| Database   | PostgreSQL + Prisma ORM                 |
| Auth       | NextAuth.js + JWT                       |
| Payments   | Stripe (subscriptions + one-off)        |
| Maps       | Google Maps API                         |

---

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- npm 9+

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

**Backend:**
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your DATABASE_URL, JWT_SECRET, Stripe keys etc.
```

**Frontend:**
```bash
cp frontend/.env.example frontend/.env.local
# Edit frontend/.env.local with your NEXTAUTH_SECRET, Google Maps key etc.
```

### 3. Set up the database

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed with demo data (optional)
cd backend && npx tsx prisma/seed.ts
```

### 4. Start development servers

```bash
# Both frontend and backend together
npm run dev

# Or individually
npm run dev:frontend   # http://localhost:3000
npm run dev:backend    # http://localhost:4000
```

---

## Database Schema

The Prisma schema (`backend/prisma/schema.prisma`) defines:

| Model            | Purpose                                              |
|------------------|------------------------------------------------------|
| `User`           | Customer accounts                                    |
| `Property`       | Property profiles (address, area, block type etc.)   |
| `Contract`       | Subscription contracts (mowing tiers + add-ons)      |
| `AddOn`          | Individual add-on services linked to a contract      |
| `Payment`        | Payment records (scheduled + completed)              |
| `ServiceVisit`   | Individual on-site visit records                     |
| `PricingSnapshot`| Audit log of pricing inputs at quote time            |
| `Account`        | NextAuth OAuth accounts                              |
| `Session`        | NextAuth sessions                                    |

---

## API Endpoints

| Method | Path                         | Description               |
|--------|------------------------------|---------------------------|
| GET    | /health                      | Health check              |
| POST   | /api/auth/register           | Register new customer     |
| POST   | /api/auth/login              | Login                     |
| GET    | /api/auth/me                 | Current user              |
| GET    | /api/users/me/contracts      | My contracts              |
| GET    | /api/users/me/properties     | My properties             |
| PATCH  | /api/users/me                | Update profile            |
| POST   | /api/properties              | Create property profile   |
| GET    | /api/properties/:id          | Get property              |
| PATCH  | /api/properties/:id          | Update property           |
| POST   | /api/contracts               | Create contract           |
| GET    | /api/contracts/:id           | Get contract              |
| PATCH  | /api/contracts/:id/cancel    | Cancel contract           |
| PATCH  | /api/contracts/:id/upgrade   | Upgrade tier              |
| GET    | /api/payments                | Payment history           |
| GET    | /api/payments/upcoming       | Upcoming payments         |
| POST   | /api/pricing/estimate        | Get price estimate        |
| POST   | /api/webhooks/stripe         | Stripe webhook handler    |

---

## Business Rules

### Tiers
- **Bronze** — Every 6 weeks. Edging, weeding, basic tidy.
- **Silver** — Every 4 weeks. + Hedge trimming, basic pest, driveway spot.
- **Gold** — Monthly/3-weekly (seasonal). + Pressure wash quarterly, advanced pest, 1hr handyman.
- **Platinum** — 3-weekly/fortnightly (seasonal). + Unlimited small jobs, annual refresh, priority booking.

### Contracts
- **12-Month Fixed**: 10% lock-in discount. Cancel = pay out remainder.
- **Flexi**: No discount. Cancel = 30 days notice.

### Discounts
- 12-month lock-in: **10% off**
- Annual payment (on 12-month only): **additional 10% off**

---

## Build Stages

- [x] **Stage 1** — Project setup & database schema
- [ ] **Stage 2** — Pricing engine
- [ ] **Stage 3** — Property profile wizard (frontend)
- [ ] **Stage 4** — Subscription & contract management
- [ ] **Stage 5** — Customer dashboard
- [ ] **Stage 6** — Full website pages

---

## Demo Credentials

After seeding the database:
- **Email:** `demo@lifeservices.com.au`
- **Password:** `demo1234`
