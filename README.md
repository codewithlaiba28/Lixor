# 🍽️ Lixor Fine Dining — AI-Powered Restaurant Platform

A full-stack restaurant management system built with **Next.js 16**, featuring an AI chatbot, WhatsApp AI receptionist (Zara), complete admin dashboard, online ordering, and table reservations.

---

## ✨ Features

### 🌐 Customer-Facing Website
- **Home Page** — Hero section, menu categories, gallery, reviews, FAQ
- **Menu Page** — Browse all dishes with images, prices, and categories
- **Book a Table** — Reserve a table with date, time slot, guest count, and optional pre-order
- **Cart & Checkout** — Add items, manage quantities, place delivery/takeaway orders
- **Gallery** — Restaurant photo gallery with moments section
- **Blog** — Food stories and articles
- **Chef Page** — Meet the team
- **About Page** — Restaurant story, mission, special events catering
- **Confirmation Page** — Order/booking confirmation screen

### 🤖 AI Chatbot (Website)
- Floating chat widget on every page
- Powered by **Cerebras AI (llama3.1-8b)** with RAG (Retrieval-Augmented Generation)
- **pgvector** for semantic search over restaurant knowledge base
- Can browse menu, add items to cart, place orders, answer questions
- Supports Urdu and English
- Auth-protected — only logged-in users can order via chatbot

### 📱 Zara — WhatsApp AI Receptionist
- Customers WhatsApp `+1 415 523 8886` → Zara answers automatically
- Powered by **Cerebras AI** + **Twilio WhatsApp Sandbox**
- Can take food orders (delivery/takeaway)
- Can book tables (checks availability, assigns table)
- Answers menu, timing, and location questions
- All orders and bookings automatically saved to database → visible in Admin Dashboard
- Speaks Urdu (Roman) and English

### 🔐 Authentication
- **Better Auth** with email/password
- Session management with PostgreSQL
- Protected routes for cart, chatbot, and admin

### 🛠️ Admin Dashboard (`/admin`)
Password-protected admin panel with 6 sections:

| Page | Features |
|------|----------|
| **Dashboard** | Live stats, charts (orders/hour, bookings/week, order types), live orders & reservations feed |
| **Reservations** | Full table with filters, search, bulk actions, side panel, new reservation form, CSV export |
| **Orders** | Table + Kanban view, filters, bulk actions, auto-refresh every 30s, side panel |
| **Tables** | Visual floor plan, table list, add/edit/toggle availability |
| **Menu Manager** | Grid view, category tabs, availability toggle, add/edit/delete items |
| **Pre-orders** | Combined reservations with pre-ordered food, kitchen status tracking, print view |
| **Zara AI** | Setup guide for WhatsApp AI agent, webhook configuration |

---

## 🏗️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 16.2.4 (App Router, Turbopack) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Database** | PostgreSQL (Neon) + pgvector |
| **ORM** | Prisma 7 |
| **Auth** | Better Auth |
| **AI (Chatbot)** | Cerebras API (llama3.1-8b) |
| **AI (WhatsApp)** | Cerebras API (llama3.1-8b) |
| **Embeddings** | Xenova/all-MiniLM-L6-v2 (local, with Vercel fallback) |
| **WhatsApp** | Twilio WhatsApp Sandbox |
| **State Management** | Zustand (cart + delivery info) |
| **Data Fetching** | SWR (admin dashboard) |
| **Charts** | Recharts |
| **Animations** | Framer Motion |
| **Forms** | React Hook Form + Zod |
| **Notifications** | Sonner |
| **Icons** | Lucide React |
| **Deployment** | Vercel |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/           # Login & Signup pages
│   ├── admin/            # Admin dashboard (6 pages)
│   │   ├── page.tsx      # Dashboard overview
│   │   ├── reservations/ # Reservations manager
│   │   ├── orders/       # Orders manager
│   │   ├── tables/       # Table manager
│   │   ├── menu/         # Menu manager
│   │   ├── combined/     # Pre-orders kitchen view
│   │   └── zara/         # Zara AI setup guide
│   ├── api/
│   │   ├── admin/        # Admin API routes (stats, reservations, orders, tables, menu, combined)
│   │   ├── auth/         # Better Auth handler
│   │   ├── chat-v2/      # AI chatbot API
│   │   └── whatsapp/     # Zara WhatsApp webhook
│   ├── about/            # About page
│   ├── blog/             # Blog page
│   ├── book/             # Table booking page
│   ├── cart/             # Cart & checkout
│   ├── chef/             # Chef page
│   ├── gallery/          # Gallery page
│   ├── menu/             # Menu page
│   └── confirmation/     # Order confirmation
├── components/           # Reusable UI components
├── data/                 # Static menu data
├── lib/
│   ├── auth.ts           # Better Auth config
│   ├── auth-client.ts    # Auth client
│   ├── embeddings.ts     # Vector embeddings
│   ├── prisma.ts         # Prisma client
│   ├── vectorSearch.ts   # pgvector search
│   └── zara.ts           # Zara AI brain
├── store/
│   └── useCart.ts        # Zustand cart store
└── scripts/              # DB utility scripts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon recommended)
- Cerebras API key
- Twilio account (for Zara WhatsApp)

### 1. Clone & Install

```bash
git clone https://github.com/codewithlaiba28/Lixor.git
cd Lixor
npm install
```

### 2. Environment Variables

Create a `.env` file:

```env
# Database
DATABASE_URL="postgresql://..."

# AI
CEREBRAS_API_KEY="csk-..."

# Auth
BETTER_AUTH_SECRET="your-secret-key"

# Admin
ADMIN_PASSWORD="your-admin-password"

# Twilio WhatsApp (Zara AI)
TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
TWILIO_AUTH_TOKEN="your-auth-token"
TWILIO_WHATSAPP_NUMBER="whatsapp:+14155238886"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Database Setup

```bash
# Push schema to database
npx prisma db push

# Seed menu items and tables
npx tsx prisma/seed.ts
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🤖 Zara WhatsApp Setup

1. Create a [Twilio account](https://twilio.com/try-twilio)
2. Go to **Messaging → Try it out → Send a WhatsApp message**
3. Send `join rabbit-herd` to `+1 415 523 8886` from your WhatsApp
4. Set webhook URL in Twilio Sandbox settings:
   ```
   https://your-app.vercel.app/api/whatsapp/webhook
   ```
5. Add Twilio env variables to Vercel
6. Deploy and test!

---

## 🔐 Admin Access

Navigate to `/admin` and enter the admin password set in `ADMIN_PASSWORD` env variable.

Default: `lixor@admin2024`

---

## 📊 Database Schema

| Model | Description |
|-------|-------------|
| `User` | Customer accounts |
| `Session` | Auth sessions |
| `MenuItem` | Restaurant menu items |
| `Order` | Food orders (delivery/takeaway) |
| `OrderItem` | Individual items in an order |
| `Reservation` | Table bookings |
| `RestaurantTable` | Restaurant tables |
| `ChatMessage` | Chat history |
| `Document` | RAG knowledge base (pgvector) |

---

## 🌐 Deployment (Vercel)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add all environment variables in Vercel Dashboard → Settings → Environment Variables
4. Deploy
5. Update `NEXT_PUBLIC_APP_URL` to your Vercel URL
6. Update Twilio webhook URL to `https://your-app.vercel.app/api/whatsapp/webhook`

---

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npx tsx prisma/seed.ts              # Seed menu & tables
npx tsx scripts/check-db.ts         # Check database status
npx tsx scripts/test-order.ts       # Test order creation
```

---

## 👩‍💻 Built By

**Laiba** — [@codewithlaiba28](https://github.com/codewithlaiba28)

---

## 📄 License

Private project — all rights reserved.
