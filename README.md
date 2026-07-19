<div align="center">

# 🛒 E-commerce — Full-Stack Electronics Storefront

**A production-grade e-commerce platform (Next.js frontend + Express/Prisma backend) with Google & email/password auth, role-based admin tooling, and Chapa payment integration for the Ethiopian market.**

[![GitHub Repo](https://img.shields.io/badge/GitHub-PixelNoah--ui%2FE--commerce-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/PixelNoah-ui/E-commerce)
[![License](https://img.shields.io/badge/License-Not%20detected-lightgrey?style=for-the-badge)](#-license)

![Next.js](https://img.shields.io/badge/Next.js-16.2-000000?style=flat-square&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express%205-339933?style=flat-square&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma%207-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma&logoColor=white)
![Chapa](https://img.shields.io/badge/Payments-Chapa-1e90ff?style=flat-square)
![Deploy](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel&logoColor=white)

</div>

---

## ⚠️ A note on branding before you read further

This repository's identity is **inconsistent across files** — verified, not guessed:

| Where                                                                                | Name found                                           |
| ------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| Chapa checkout `customization.title` (`backend/src/services/chapaService.ts`)        | `"PixelShop"`                                        |
| Transactional email `from` name (`backend/src/utils/sendEmail.ts`)                   | `"PixelShops"`                                       |
| Backend CORS allow-list (`backend/src/index.ts`)                                     | `pixelshops.vercel.app`, `pixelshopadmin.vercel.app` |
| Frontend SEO metadata (`frontend/src/app/layout.tsx`)                                | `"PixelShop"`                                        |
| Frontend cart's `localStorage` key (`frontend/src/components/cart/CartProvider.tsx`) | `"pixelshop_cart_v1"`                                |

This reads as a **shared/white-labeled codebase reused across multiple client storefronts** (Abdu Electronics, Meqdii Electronics) with a leftover "PixelShop" template identity never fully swapped out. This README documents the _code_, not a single brand — treat every reference to a shop name below as descriptive, not definitive. This mismatch is also logged under [Code Quality Review](#-code-quality-review).

---

## 📖 Project Overview

This is a **two-package monorepo** — `frontend/` (Next.js 16, App Router) and `backend/` (Express 5 + Prisma 7 + PostgreSQL) — implementing a full electronics e-commerce storefront for the Ethiopian market (ETB currency, Ethiopian phone-number validation, Addis Ababa–oriented copy).

**Who it's for:** an electronics retailer that needs a real storefront (not a template) with product browsing, reviews, wishlists, a persistent cart, real payment processing via **Chapa**, order tracking, and a role-gated back office for admins/managers — not just a customer-facing shop.

**What it solves, verified from the code:**

- A full checkout pipeline with **server-side price/stock validation**, a **Chapa payment gateway integration**, idempotent order creation, and email notifications on order/payment events.
- **Two parallel auth systems**: Google Sign-In for customers and email/password for staff — sharing one `User` model distinguished by a `role` enum (`ADMIN`, `MANAGER`, `USER`).
- Customer account features: multiple saved addresses (with a default), order history with receipts, product reviews, and a wishlist.
- An admin/manager surface: dashboard stats, product CRUD with Cloudinary image processing, and manager-account management — gated (mostly, see [Code Quality Review](#-code-quality-review)) by role.

---

## 🖼️ Screenshots

**Not detected from the current codebase.** No `screenshots/` or `docs/screenshots/` directory exists in this repository, and no live demo URL was provided for this specific repo. Placeholders below reflect the pages that exist in the frontend, per the original task template:

```
docs/screenshots/
├── home.png
├── products.png
├── myorder.png
└──
```

_(Replace these placeholders with real screenshots after deployment.)_

---

## ✨ Features

### Customer Features

- 🏠 Home page with hero, category rail, and a "why choose us" section
- 🔍 Product browsing at `/equipments` (search, price-range filter, sort) and `/electronics/[slug]` (category-scoped, same filters)
- 📄 Individual product pages (`/products/[id]`)
- ⭐ Product reviews — one review per user per product, editable/deletable by its author (`customer/reviewController.ts`)
- ❤️ Wishlist — add/remove/list, unique per user+product
- 🛒 Persistent cart via React Context + `localStorage` (`CartProvider.tsx`), with a promo/coupon slot in state (see caveat below)
- 📍 Multiple saved addresses per user with a single default, full CRUD (`/profile/addresses`)
- 💳 Checkout: cart validation → shipping/customer info → **Chapa** hosted checkout redirect → callback-driven order finalization
- 📦 Order history (`/orders`), order detail, and a printable receipt page (`/orders/[id]/receipt`)
- 👤 Profile settings, including password change
- ✉️ Public contact form that emails the store owner

### Admin Features

- 📊 Dashboard stats endpoint (`/api/v1/dashboard`) — user/product counts, role distribution, growth-over-time chart data (week/month/year)
- 🗂️ Product CRUD with image upload → Sharp resize/webp conversion → Cloudinary storage
- 👥 Manager account management (create/list/get/update/delete `MANAGER`-role users), restricted to `ADMIN`
- 🏢 Owner/business address management (single-record upsert pattern) — publicly readable, admin-writable
- 📦 Order status updates (`PATCH /api/v1/orders/:orderId`) — **see the authorization gap flagged below**

> ⚠️ There is no dedicated admin _frontend_ route/dashboard UI found under `frontend/src/app` — only the backend endpoints exist. If an admin panel UI exists, it lives in a separate repository (the CORS allow-list includes a `pixelshopadmin.vercel.app` origin, implying a separate admin frontend not present here).

### Authentication

Two distinct paths sharing one `User` table (`role: ADMIN | MANAGER | USER`):

- **Google Sign-In** (customers): ID token verified server-side via `google-auth-library`; auto-creates or links a `User` row by `googleId`/email
- **Email + password** (signup/login): bcrypt-hashed passwords, account lockout after 5 failed attempts (15-minute lock), password-reset via emailed token
- Sessions are **JWT in an httpOnly cookie** (`token`), 7-day expiry; `Authorization: Bearer` header is also accepted as a fallback
- Role-gated routes via a `restrictTo(...roles)` middleware — but see the exceptions below

### Payments

- **Chapa** is the only payment gateway integrated (`backend/src/services/chapaService.ts`) — initializes a hosted checkout session, verifies transactions server-to-server, and validates an optional webhook HMAC signature
- No Stripe/PayPal or manual bank-transfer flow exists in this repository (unlike the `pixelshop` repo under this same account, which uses a manual Ethiopian-bank selection instead)
- A `CheckoutSession` table stores pending checkout state (cart snapshot, customer info, totals) keyed by Chapa's `tx_ref`, so the callback can finalize the real `Order`/`Payment`/`OrderItem` rows idempotently inside a Prisma transaction

### Order Management

- Orders carry `status` (`PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED → CANCELLED`) and `paymentStatus` (`PENDING → PROCESSING → PAID → FAILED → CANCELLED → REFUNDED`) enums
- Successful Chapa payment: server creates the `Order`, `OrderItem`s, and `Payment` row, decrements `Product.quantity`, and marks the `CheckoutSession` `COMPLETED` — all in one transaction
- Customers can view their own orders and a generated invoice number / estimated delivery date

### Product Management

- Full CRUD via `productsController.ts`, image handling via `multer` (memory storage, 5MB limit, image-only filter) → `sharp` (resize to 1000×1000, convert to WebP) → Cloudinary
- Products support `specifications` as a free-form JSON field, a `sku`, `isFeatured`/`isActive` flags, and category filtering

### Performance

- Paginated product queries (9/page storefront, 10/page admin) with `Promise.all`-parallelized count+fetch
- Dashboard queries batched with `prisma.$transaction([...])` to run as one round trip
- Cloudinary image pipeline resizes and converts to WebP before upload, keeping delivered images small
- `express-rate-limit` applied globally to all `/api` routes (100 requests / 15 min)

### Security

- `helmet` for HTTP security headers, `cookie-parser` + httpOnly JWT cookie, `cors` with an explicit origin allow-list, request body size capped at `10kb`
- Passwords hashed with `bcryptjs` (cost factor 12); login lockout after repeated failures
- Optional Chapa webhook signature verification via HMAC-SHA256 (falls back to "allow" if `CHAPA_SECRET_KEY`/signature header is absent — see caveat below)
- **Two verified authorization gaps** exist in the current code — see [Code Quality Review](#-code-quality-review); this is not a hypothetical concern, it's read directly from the router definitions

### Responsive Design

Tailwind CSS v4 + shadcn/ui (Radix primitives) used throughout the frontend; not independently verified against every breakpoint, but utility classes are applied consistently across page/component files.

---

## 🧰 Tech Stack

| Layer                 | Technology                                                                                                                                                                                                                     | Notes      |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| Frontend framework    | Next.js 16.2.1 (App Router)                                                                                                                                                                                                    | React 19.2 |
| Frontend language     | TypeScript 5                                                                                                                                                                                                                   |            |
| Frontend styling      | Tailwind CSS v4, shadcn/ui, Radix UI (`radix-ui` meta-package)                                                                                                                                                                 |            |
| Frontend state/data   | TanStack React Query v5, React Context (cart)                                                                                                                                                                                  |            |
| Frontend animation    | Framer Motion, Embla Carousel                                                                                                                                                                                                  |            |
| Frontend auth widget  | `@react-oauth/google`                                                                                                                                                                                                          |            |
| Forms/validation      | `react-hook-form` + `@hookform/resolvers` + Zod                                                                                                                                                                                |            |
| Backend framework     | Express 5                                                                                                                                                                                                                      |            |
| Backend language      | TypeScript, compiled via `tsc` (no `ts-node` in prod path)                                                                                                                                                                     |            |
| ORM / DB              | Prisma 7 (`@prisma/client`, `@prisma/adapter-pg`) over PostgreSQL (`pg` driver)                                                                                                                                                |            |
| Auth                  | Custom JWT (`jsonwebtoken`) + `bcryptjs`; Google ID-token verification (`google-auth-library`); `passport` / `passport-google-oauth20` are dependencies but **no passport strategy is wired up** in the code read (see caveat) |
| Payments              | Chapa (custom fetch-based integration, no official SDK dependency)                                                                                                                                                             |            |
| Image handling        | `multer` (upload) → `sharp` (resize/convert) → `cloudinary` (storage)                                                                                                                                                          |            |
| Email                 | `nodemailer`                                                                                                                                                                                                                   |            |
| Security middleware   | `helmet`, `express-rate-limit`, `cors`, `cookie-parser`                                                                                                                                                                        |            |
| Logging               | `morgan` (dev-format request logging)                                                                                                                                                                                          |            |
| Dev tooling           | `nodemon`, `concurrently`, `rimraf`, `ts-node-dev` (present but `dev` script uses `tsc -w` + `nodemon`, not `ts-node-dev`)                                                                                                     |            |
| Deployment (inferred) | Vercel (from CORS origins `*.vercel.app`); no `vercel.json` or Dockerfile in repo                                                                                                                                              |            |

---

## 🏗️ Architecture

### High-level architecture

```mermaid
flowchart LR
    subgraph FE["frontend/ (Next.js, Vercel)"]
        UI["App Router pages\n+ Server Components"]
        Cart["CartProvider\n(React Context + localStorage)"]
        MW["middleware.ts\n(cookie-presence route guard)"]
    end

    subgraph BE["backend/ (Express, Node host)"]
        Routers["/api/v1/* routers"]
        Auth["AuthController\n(JWT + Google + email/password)"]
        Ctrls["Controllers\n(products, orders, addresses, reviews, wishlist, dashboard, managers, owner)"]
        Mid["helmet / rate-limit / cors\n/ cookie-parser"]
    end

    subgraph Data["Data & external services"]
        PG[("PostgreSQL\nvia Prisma")]
        Cloudinary["Cloudinary\n(product images)"]
        Chapa["Chapa\n(payment gateway)"]
        Google["Google OAuth"]
        SMTP["SMTP\n(nodemailer)"]
    end

    UI --> Routers
    Cart --> UI
    MW -.guards.-> UI
    Routers --> Mid --> Ctrls
    Ctrls --> Auth
    Ctrls --> PG
    Ctrls --> Cloudinary
    Ctrls --> Chapa
    Auth --> Google
    Ctrls --> SMTP
```

### Authentication flow (dual path)

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant API as Backend /api/v1/auth
    participant DB as Postgres (User table)
    participant G as Google

    alt Email + password
        U->>FE: Submit signup/login form
        FE->>API: POST /signup or /login
        API->>DB: bcrypt hash / compare
        API-->>FE: Set httpOnly JWT cookie
    else Google Sign-In
        U->>FE: Click "Continue with Google"
        FE->>G: Get ID token
        FE->>API: POST /google { credential }
        API->>G: verifyIdToken()
        API->>DB: find-or-create by googleId/email
        API-->>FE: Set httpOnly JWT cookie
    end

    U->>FE: Visit /orders, /profile, /checkout
    FE->>FE: middleware.ts checks for "token" cookie presence
    API->>API: protect middleware verifies JWT + loads req.user on every protected API call
```

### Checkout & payment flow

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant API as Backend /checkout
    participant DB as Postgres
    participant Chapa as Chapa

    U->>FE: Proceed to checkout
    FE->>API: POST /validate (cart items)
    API->>DB: Verify products exist, active, price
    API-->>FE: Subtotal / shipping / tax / total (ETB)
    FE->>API: POST /initialize (items + customer info)
    API->>DB: Create CheckoutSession (status=INITIATED)
    API->>Chapa: initialize payment (amount, txRef, callback/return URLs)
    Chapa-->>API: checkout_url
    API-->>FE: checkoutUrl
    FE->>Chapa: Redirect user to hosted checkout
    Chapa->>API: GET/POST /chapa/callback (tx_ref, status)
    API->>Chapa: verify(tx_ref)
    alt payment successful
        API->>DB: Transaction: create Order + OrderItems + Payment,\ndecrement Product.quantity, mark session COMPLETED
        API-->>U: Email payment confirmation
    else payment failed
        API->>DB: mark CheckoutSession FAILED
        API-->>U: Email payment failure notice
    end
```

### Entity relationships (from `prisma/schema.prisma`)

```mermaid
erDiagram
    USER ||--o{ USERADDRESS : has
    USER ||--o{ ORDER : places
    USER ||--o{ REVIEW : writes
    USER ||--o{ WISHLISTITEM : saves
    USER ||--o{ CHECKOUTSESSION : starts
    USERADDRESS ||--o{ ORDER : "ships to"
    PRODUCT ||--o{ ORDERITEM : "sold as"
    PRODUCT ||--o{ REVIEW : receives
    PRODUCT ||--o{ WISHLISTITEM : "saved as"
    ORDER ||--o{ ORDERITEM : contains
    ORDER ||--o| PAYMENT : "paid via"

    USER {
        string id PK
        string email UK
        string password
        string googleId UK
        enum role
        string fullName
    }
    PRODUCT {
        string id PK
        string name
        decimal price
        string categoryType
        string sku UK
        boolean isFeatured
        boolean isActive
    }
    ORDER {
        string id PK
        string orderNumber UK
        enum status
        enum paymentStatus
        decimal total
    }
    PAYMENT {
        string id PK
        string orderId FK UK
        string transactionId
        string provider
        enum status
    }
    CHECKOUTSESSION {
        string id PK
        string txRef UK
        string orderNumber
        json customer
        json items
        json totals
    }
    OWNERADDRESS {
        string id PK
        string email UK
    }
```

---

## 📁 Folder Structure

```text
E-commerce/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma           # Full data model (see Database Documentation)
│   │   └── migrations/             # One migration: 20260713083403_init
│   └── src/
│       ├── controller/             # Auth, products, orders, addresses, dashboard, managers, owner
│       │   └── customer/           # reviewController.ts, wishlistController.ts
│       ├── router/                 # One router per resource, mounted under /api/v1
│       ├── middleware/             # auth.ts (restrictTo), uploadImages.ts (multer+sharp+cloudinary)
│       ├── services/                # chapaService.ts, notificationService.ts
│       ├── lib/                    # Prisma.ts, cloudinary.ts
│       ├── utils/                  # AppError, catchAsync, email templates, paymentLifecycle
│       ├── generated/prisma/       # Prisma client output (generated, not hand-written)
│       ├── index.ts                # Express app assembly (middleware + route mounting)
│       └── server.ts               # Process entrypoint, graceful shutdown handling
└── frontend/
    └── src/
        ├── app/
        │   ├── (api)/               # Client-side fetch wrappers (auth, products, orders, addresses)
        │   ├── auth/                 # Login/signup page
        │   ├── cart/, checkout/      # Cart and checkout pages
        │   ├── electronics/[slug]/   # Category-scoped product listing
        │   ├── equipments/           # Main product listing with filters
        │   ├── products/[id]/        # Product detail page
        │   ├── orders/[id]/          # Order detail + receipt
        │   ├── profile/addresses/    # Address management
        │   ├── about/, contact/, privacy/, terms/
        │   └── layout.tsx, page.tsx  # Root layout & home page
        ├── components/
        │   ├── cart/                 # CartProvider, CartSheet, CartItemCard
        │   ├── layout/                # Header, Footer, nav
        │   ├── orders/, profile/, reviews/, feature/
        │   └── ui/                    # shadcn/ui primitives
        ├── hooks/                    # useCart, useOrders, useProducts, useCoupon, useGoogleLogin, etc.
        ├── lib/                      # auth.ts, checkout.ts, currency.ts, react-query.ts, utils.ts
        ├── middleware.ts             # Route-guard by cookie presence
        └── types/                    # Types.ts, cart.ts
```

---

## ⚙️ Installation

The backend and frontend are independent npm packages — install and run each separately.

```bash
# 1. Clone
git clone https://github.com/PixelNoah-ui/E-commerce.git
cd E-commerce

# 2. Backend
cd backend
npm install
cp .env.example .env        # fill in the values — see below
npm run generate             # prisma generate
# apply the existing migration to your database:
npx prisma migrate deploy
npm run dev                  # builds once, then watches + runs dist/server.js via nodemon
# API runs at http://localhost:8000 (PORT is configurable)

# 3. Frontend (in a separate terminal)
cd ../frontend
npm install
cp .env.example .env.local   # fill in the values — see below
npm run dev
# App runs at http://localhost:3000
```

Note the backend's `dev`/`start` scripts run `tsc` to compile to `dist/` first, then execute the compiled output — there is no direct `ts-node` execution path in `package.json`, despite `ts-node-dev` being a listed dependency.

---

## 🔑 Environment Variables

Only variables actually referenced via `process.env.*` in the source are listed — nothing here is guessed.

**`backend/.env`**

```bash
# Server
PORT=8000
NODE_ENV=development

# Database (Prisma + pg adapter)
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Auth
JWT_SECRET=your_jwt_signing_secret
GOOGLE_CLIENT_ID=your_google_oauth_client_id

# Chapa payment gateway
CHAPA_SECRET_KEY=your_chapa_secret_key
CHAPA_BASE_URL=https://api.chapa.co/v1/transaction   # optional, this is the default
CHAPA_CALLBACK_URL=https://your-api-domain.com/api/v1/checkout/chapa/callback
CHAPA_RETURN_URL=https://your-frontend-domain.com/checkout/success
# CALLBACK_URL / RETURN_URL are accepted as fallback names for the two above

# URLs used to build absolute links
CLIENT_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000

# Cloudinary (product image storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Outbound email (nodemailer)
EMAIL_HOST=your_smtp_service_name   # passed directly as nodemailer's `service` option
EMAIL_USERNAME=your_email_address
EMAIL_PASSWORD=your_email_password_or_app_password
ADMIN_EMAIL=owner@example.com        # optional — admin notification emails are skipped if unset
```

**`frontend/.env.local`**

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id
NEXT_PUBLIC_CURRENCY_CODE=ETB
NEXT_PUBLIC_CURRENCY_DISPLAY=symbol
```

---

## 🗄️ Database Documentation

Source of truth: `backend/prisma/schema.prisma`, with one migration (`20260713083403_init`) applied. PostgreSQL is the provider (`datasource db { provider = "postgresql" }`); a Neon-hosted instance was referenced in prior project notes but that hosting detail isn't verifiable from this repository's code alone.

### Models

| Model             | Purpose                                            | Key fields                                                                                                         | Constraints                                            |
| ----------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| `User`            | Customers and staff (single table, `role` enum)    | `email`, `password?`, `googleId?`, `role`, lockout fields (`failedLoginAttempts`, `lockUntil`), reset-token fields | `email` unique, `googleId` unique                      |
| `CheckoutSession` | Pending/in-flight Chapa checkout state             | `txRef`, `orderNumber`, `status`, `customer`/`items`/`totals` (JSON)                                               | `txRef` unique                                         |
| `UserAddress`     | Customer shipping addresses                        | `fullName`, `phone`, `country`, `city`, `address`, `isDefault`                                                     | FK → `User`, cascade delete                            |
| `Product`         | Catalog items                                      | `price` (Decimal 10,2), `categoryType`, `sku?`, `specifications` (JSON), `isFeatured`, `isActive`                  | `sku` unique                                           |
| `Review`          | Product reviews                                    | `rating` (Int), `title?`, `comment?`                                                                               | one review per (`userId`,`productId`)                  |
| `WishlistItem`    | Saved products                                     | —                                                                                                                  | one entry per (`userId`,`productId`)                   |
| `Order`           | Placed orders                                      | `orderNumber`, `subtotal`/`shipping`/`tax`/`total` (Decimal), `status`, `paymentStatus`                            | `orderNumber` unique, FK → `User`, `UserAddress`       |
| `OrderItem`       | Line items                                         | `quantity`, `price`, `total`, `selectedSize?`, `selectedColor?`                                                    | FK → `Order` (cascade), `Product`                      |
| `Payment`         | One payment per order                              | `transactionId?`, `provider?`, `amount`, `status`                                                                  | `orderId` unique (1:1 with `Order`), FK cascade delete |
| `OwnerAddress`    | Store/business contact info (single row, fixed ID) | `fullName`, `email`, `phone?`, `address?`, `location?`                                                             | `email` unique                                         |

### Enums

```prisma
enum Role          { ADMIN MANAGER USER }
enum OrderStatus   { PENDING CONFIRMED PROCESSING SHIPPED DELIVERED CANCELLED }
enum PaymentStatus { PENDING PROCESSING PAID FAILED CANCELLED REFUNDED }
```

### ER Diagram

See the [Architecture](#-architecture) section above for the full Mermaid ER diagram.

**Not detected from the current codebase:** any `Coupon`/discount table — the frontend has a `useTodayCoupon()` hook calling `GET /coupons/today`, but no coupon model, controller, or route exists anywhere in `backend/`. This is a dead/broken feature, flagged again below.

---

## 📡 API Documentation

Base path: `/api/v1`. All routers are mounted in `backend/src/index.ts`.

### Auth — `/api/v1/auth`

| Method | Route                    | Auth                           | Description                                                                                                      |
| ------ | ------------------------ | ------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| POST   | `/signup`                | Public                         | Email/password registration (role forced to `USER`)                                                              |
| POST   | `/login`                 | Public                         | Email/password login; locks account for 15 min after 5 failed attempts                                           |
| POST   | `/google`                | Public                         | Verifies a Google ID token, finds-or-creates a `User`                                                            |
| POST   | `/forgot-password`       | Public                         | Emails a password-reset link                                                                                     |
| POST   | `/reset-password/:token` | Public                         | Consumes the reset token, sets a new password                                                                    |
| GET    | `/me`                    | Authenticated                  | Returns the current user's profile                                                                               |
| POST   | `/logout`                | Authenticated                  | Clears the JWT cookie                                                                                            |
| PATCH  | `/me`                    | Authenticated                  | Updates `fullName`/`email`                                                                                       |
| PATCH  | `/update-password`       | **Authenticated + ADMIN only** | ⚠️ See caveat below — this restricts a normal "change my password" action to admins only, which looks unintended |

### Products — `/api/v1/products`

| Method | Route             | Auth                      | Description                                                                     |
| ------ | ----------------- | ------------------------- | ------------------------------------------------------------------------------- |
| GET    | `/new-arrivals`   | Public                    | Latest 4 active products                                                        |
| GET    | `/`               | Public                    | Paginated/filterable/sortable active products (search, category, price range)   |
| POST   | `/`               | **Authenticated only** ⚠️ | Create a product — see authorization gap below                                  |
| GET    | `/admin-products` | **Authenticated only** ⚠️ | Unfiltered admin product list (includes inactive) — see authorization gap below |
| GET    | `/:id`            | Authenticated             | Single product lookup                                                           |
| PATCH  | `/:id`            | ADMIN                     | Update a product (re-uploads image if provided)                                 |
| DELETE | `/:id`            | ADMIN                     | Delete a product                                                                |

### Orders — `/api/v1/orders`

| Method | Route       | Auth                      | Description                                                                                                                            |
| ------ | ----------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/`         | Authenticated             | Current user's orders                                                                                                                  |
| PATCH  | `/:orderId` | **Authenticated only** ⚠️ | Update `status`/`paymentStatus` of **any** order by ID — no ownership or role check. See [Code Quality Review](#-code-quality-review). |

### Checkout — `/api/v1/checkout`

| Method     | Route             | Auth                   | Description                                                                                 |
| ---------- | ----------------- | ---------------------- | ------------------------------------------------------------------------------------------- |
| POST       | `/validate`       | Authenticated          | Server-side cart validation, returns subtotal/shipping/tax/total                            |
| POST       | `/initialize`     | Authenticated          | Creates a `CheckoutSession`, initializes a Chapa payment, returns the hosted checkout URL   |
| GET        | `/orders`         | Authenticated          | Alias of `orderRouter`'s `getUserOrders`                                                    |
| GET        | `/order/:orderId` | Authenticated          | Order detail by ID or order number; falls back to checking pending `CheckoutSession` status |
| GET / POST | `/chapa/callback` | Public (Chapa webhook) | Verifies payment with Chapa, finalizes the order transactionally                            |

### Addresses — `/api/v1/addresses`

| Method | Route                 | Auth          | Description                                     |
| ------ | --------------------- | ------------- | ----------------------------------------------- |
| GET    | `/`                   | Authenticated | List the current user's addresses               |
| POST   | `/`                   | Authenticated | Create an address (optionally set as default)   |
| PATCH  | `/:addressId`         | Authenticated | Update an address (ownership checked)           |
| DELETE | `/:addressId`         | Authenticated | Delete an address (reassigns default if needed) |
| PATCH  | `/:addressId/default` | Authenticated | Set an address as default                       |

### Customer — `/api/v1/customer`

| Method | Route                          | Auth          | Description                            |
| ------ | ------------------------------ | ------------- | -------------------------------------- |
| GET    | `/products/:productId/reviews` | Authenticated | List reviews for a product             |
| POST   | `/products/:productId/reviews` | Authenticated | Create a review (one per user/product) |
| PATCH  | `/reviews/:reviewId`           | Authenticated | Update own review                      |
| DELETE | `/reviews/:reviewId`           | Authenticated | Delete own review                      |
| GET    | `/wishlist`                    | Authenticated | List wishlist                          |
| POST   | `/wishlist/:productId`         | Authenticated | Add to wishlist                        |
| DELETE | `/wishlist/:productId`         | Authenticated | Remove from wishlist                   |

### Dashboard — `/api/v1/dashboard`

| Method | Route                        | Auth                      | Description                                                                           |
| ------ | ---------------------------- | ------------------------- | ------------------------------------------------------------------------------------- |
| GET    | `/?period=week\|month\|year` | **Authenticated only** ⚠️ | User/product counts, role distribution, growth chart — no role restriction; see below |

### Managers — `/api/v1/managers` (all routes ADMIN-only)

| Method | Route  | Description                                          |
| ------ | ------ | ---------------------------------------------------- |
| GET    | `/`    | List admin/manager staff (searchable, paginated)     |
| POST   | `/`    | Create a `MANAGER` user (with optional image upload) |
| GET    | `/:id` | Get a manager                                        |
| PATCH  | `/:id` | Update a manager                                     |
| DELETE | `/:id` | Delete a manager                                     |

### Owner address — `/api/v1/ownerAddress`

| Method                | Route | Auth   | Description                                                              |
| --------------------- | ----- | ------ | ------------------------------------------------------------------------ |
| GET                   | `/`   | Public | Read the single business-address record                                  |
| POST / PATCH / DELETE | `/`   | ADMIN  | Create/update/delete the business address (upsert pattern on a fixed ID) |

### Contact — `/api/v1/contact/messages`

| Method | Route | Auth   | Description                                                                     |
| ------ | ----- | ------ | ------------------------------------------------------------------------------- |
| POST   | `/`   | Public | Validated (Ethiopian phone regex) contact-form submission, emailed to the store |

### Misc

| Method | Route           | Description                                             |
| ------ | --------------- | ------------------------------------------------------- |
| GET    | `/api/v1/test`  | Health check — returns `{ message: "API is working!" }` |
| ALL    | `*` (unmatched) | 404 JSON response                                       |

---

## 🔐 Authentication

- **Two paths, one `User` table:** Google OAuth (`role` defaults to `USER`) and email/password (signup always creates `role: USER`; `MANAGER`/`ADMIN` accounts can only be created via the ADMIN-only `/managers` endpoint — there is no self-serve admin signup)
- **Session:** JWT signed with `JWT_SECRET`, 7-day expiry, stored in an `httpOnly` cookie named `token`; `Authorization: Bearer <token>` is accepted as a fallback for non-browser clients
- **Password security:** bcrypt (cost 12), account lockout after 5 failed attempts for 15 minutes, `passwordChangedAt` invalidates tokens issued before a password change
- **Frontend route guard:** `frontend/src/middleware.ts` only checks whether a `token` cookie is _present_, not whether it's valid — actual verification happens server-side on each protected API call via the backend's `protect` middleware. This is a reasonable pattern (avoids verifying JWTs in Edge middleware) but means a stale/invalid cookie will still get a user past the frontend redirect until an API call fails.
- **`passport` / `passport-google-oauth20` are installed dependencies but no Passport strategy, `passport.initialize()`, or `passport.authenticate()` call was found anywhere in the code read** — Google auth is implemented directly via `google-auth-library`'s `OAuth2Client.verifyIdToken`, not Passport. These two dependencies appear to be unused.

⚠️ **Caveat found in `authRouter.ts`:**

```ts
router.use(protect);
router.get("/me", getMe);
router.post("/logout", logout);
router.patch("/me", updateMe);
router.use(restrictTo("ADMIN"));
router.patch("/update-password", updatePassword);
```

`restrictTo("ADMIN")` is applied to the router _before_ the `/update-password` route, so **only ADMIN-role users can hit "change my password."** A normal customer or manager changing their own password would get a 403. This looks like a copy-paste/ordering mistake rather than an intended restriction — flagged again in the audit below.

---

## 🌍 Deployment

- **Frontend:** deployed to Vercel based on the CORS allow-list (`pixelshops.vercel.app` in `backend/src/index.ts`); no `vercel.json` in the repo, relying on Next.js/Vercel defaults.
- **Backend:** the CORS allow-list also references `pixelshopadmin.vercel.app`, implying a separate admin frontend deployment not present in this repository. No Dockerfile, `Procfile`, or platform-specific config for the backend was found — hosting platform is **not detected from the current codebase**.
- **Database:** PostgreSQL via `DATABASE_URL` + `@prisma/adapter-pg`; prior project notes reference Neon as the host, but that isn't verifiable from code in this repo alone.
- **Production build:** `npm run build` (backend: `rimraf dist && tsc`; frontend: `next build`); `npm start` for the backend runs `node dist/server.js` after rebuilding.
- **CI/CD:** **not detected from the current codebase** — no `.github/workflows` directory in either package.
- **Domain coupling:** the production auth cookie is hard-coded to `domain: ".abdulectroncs.com"` — redeploying under a different domain requires editing `AuthController.ts`, not just environment variables.

---

## 🛡️ Security

**Present, verified in code:**

- `helmet` HTTP headers, explicit CORS origin allow-list with `credentials: true`, `cookie-parser`, JSON body size capped at `10kb`
- `express-rate-limit`: 100 requests / 15 minutes on all `/api` routes
- Passwords bcrypt-hashed (cost 12); login lockout after 5 failed attempts
- JWT in an `httpOnly`, `secure` (prod), `sameSite: "none"` (prod) cookie
- Ownership checks on addresses, reviews, and wishlist items (`WHERE userId: req.user.id`)
- Chapa webhook signature verification via HMAC-SHA256 — **but only enforced if both `CHAPA_SECRET_KEY` and a signature header are present; if either is missing, `validateChapaSignature` returns `true` and the callback is accepted unverified.** This is a legitimate security gap in a production deployment where the secret or header might silently not be configured.

**Two verified authorization gaps (not hypothetical — read directly from the routers):**

1. `PATCH /api/v1/orders/:orderId` only requires `protect` (any authenticated user), with no ownership check on the order and no role restriction in `updateOrderStatus`. **Any logged-in customer can change the status/paymentStatus of any order in the system**, including their own, to `DELIVERED`/`PAID`.
2. `POST /api/v1/products` (`createProduct`) and `GET /api/v1/products/admin-products` (`getAdminProducts`) only require `protect`, not `restrictTo("ADMIN")` — the role restriction in `productRouter.ts` is applied _after_ these two routes are registered. **Any logged-in customer can create products and view the admin product list.**

Both are High-severity findings, detailed again in [Code Quality Review](#-code-quality-review).

---

## ⚡ Performance Optimizations

- Product listing queries run count + fetch in parallel (`Promise.all`)
- Dashboard stats batch multiple counts into a single `prisma.$transaction([...])` round trip
- Product images are resized to 1000×1000 and converted to WebP (`sharp`) before upload to Cloudinary, reducing payload size
- Pagination is applied on both the public catalog (9/page) and admin catalog (10/page) rather than returning full tables
- Frontend uses React Query for client-side caching of orders/products/reviews

---

## 🔎 Code Quality Review

| Severity     | Problem                                                                                                                                                                                     | Impact                                                                                                                                       | Recommended Solution                                                                                                 |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Critical** | `PATCH /api/v1/orders/:orderId` has no ownership or role check                                                                                                                              | Any authenticated customer can mark **any** order (their own or someone else's) as `DELIVERED`/`PAID` without actually paying or being staff | Add `restrictTo("ADMIN", "MANAGER")` to this route, or restrict customers to read-only order access                  |
| **High**     | `POST /api/v1/products` and `GET /api/v1/products/admin-products` sit before `router.use(restrictTo("ADMIN"))` in `productRouter.ts`                                                        | Any logged-in customer can create arbitrary products or view the full (including inactive) admin product catalog                             | Reorder the router so `restrictTo("ADMIN")` is applied before these two routes                                       |
| **High**     | `authRouter.ts` applies `restrictTo("ADMIN")` before `/update-password`, so only admins can change their own password                                                                       | Regular customers and managers cannot self-serve a password change                                                                           | Move `/update-password` above the `restrictTo("ADMIN")` line, gated only by `protect`                                |
| **High**     | `GET /api/v1/dashboard` has no role restriction, only `protect`                                                                                                                             | Any authenticated customer can view internal business metrics (user counts, product growth, role distribution)                               | Add `restrictTo("ADMIN", "MANAGER")`                                                                                 |
| **Medium**   | Chapa webhook signature check silently passes (`return true`) when `CHAPA_SECRET_KEY` or the signature header is missing                                                                    | A misconfigured deployment silently accepts unverified payment callbacks instead of failing loudly                                           | Fail closed (reject) when signature verification can't be performed in production, or log a loud warning             |
| **Medium**   | `useTodayCoupon()` in the frontend calls `GET /coupons/today`, but no `Coupon` model, controller, or route exists in the backend at all                                                     | Dead/broken feature — this call will always 404 in production                                                                                | Either implement the coupon backend or remove the dead frontend hook/UI referencing it                               |
| **Medium**   | Product stock is decremented (`quantity: { decrement }`) in `finalizeSuccessfulCheckout` without checking that quantity won't go negative or that stock was still available at payment time | Possible overselling under concurrent checkouts of the last unit(s)                                                                          | Add a stock guard/condition inside the transaction, or reserve stock at `initializeCheckout` time                    |
| **Medium**   | Branding is inconsistent across the codebase (Abdu Electronics / Meqdii Electronics / PixelShop — see the note at the top of this README)                                                   | Confusing for new contributors; risk of leaking one client's branding into another's deployment                                              | Parameterize brand name, cookie domain, and `localStorage` key via environment variables instead of hard-coding them |
| **Low**      | Production auth cookie `domain` is hard-coded to `.abdulectroncs.com` in `AuthController.ts`                                                                                                | Deploying to a different domain silently breaks cookie-based auth in production until the source is edited                                   | Read the cookie domain from an environment variable                                                                  |
| **Low**      | `passport` and `passport-google-oauth20` are dependencies with no corresponding strategy setup found in the code                                                                            | Unused dependencies increase install size and can mislead contributors about how Google auth actually works                                  | Remove them, since `google-auth-library` already handles the flow directly                                           |
| **Low**      | Diagnostic `console.log` left in production code paths (`checkoutController.ts`'s Chapa verify log, `frontend/src/middleware.ts`'s per-request pathname/token log)                          | Log noise, minor information exposure (the middleware log prints the raw token cookie value)                                                 | Remove or gate behind `NODE_ENV !== "production"`                                                                    |
| **Low**      | No automated tests found (no `*.test.*`/`*.spec.*` files, no test runner configured in either `package.json`)                                                                               | Regressions like the authorization gaps above aren't caught automatically                                                                    | Add integration tests for the auth/role matrix and checkout flow                                                     |
| **Low**      | No `.github/workflows` in either package                                                                                                                                                    | No CI to catch build/type errors or the issues above before merge                                                                            | Add a workflow running `tsc --noEmit`, `next build`, and lint on PRs                                                 |
| **Low**      | `frontend/README.md` is still the default `create-next-app` boilerplate                                                                                                                     | Doesn't describe this project at all                                                                                                         | Replace with a frontend-specific quickstart, or point to this root README                                            |
| **Low**      | No `LICENSE` file in the repository                                                                                                                                                         | Reuse/contribution terms are unclear                                                                                                         | Add a license (see [License](#-license))                                                                             |

---

## 🔭 Future Improvements

- Fix the two authorization gaps in `orderRouter.ts` and `productRouter.ts` before this goes anywhere near production traffic
- Fix the `/update-password` role restriction so customers can self-serve password changes
- Decide the coupon feature's fate: implement the backend or remove the dangling frontend hook
- Parameterize the hard-coded cookie domain and per-client branding (name, logo, storage keys) via environment/config instead of source edits
- Add a stock-availability guard inside the checkout transaction to prevent overselling
- Add automated tests and a CI pipeline
- Add a `LICENSE` file and replace the frontend's boilerplate README

---

## 🤝 Contributing

1. Fork the repository and create a feature branch: `git checkout -b feat/your-feature`
2. Install dependencies in **both** `backend/` and `frontend/` — they're independent npm packages
3. Run `npm run generate` in `backend/` after any Prisma schema change, and create a migration with `npx prisma migrate dev`
4. Match the existing code style (TypeScript strict patterns, `catchAsync`/`AppError` for backend error handling)
5. If your change affects a route's auth requirements, double-check the router's middleware ordering — this codebase has real examples (above) of why that matters
6. Open a pull request against `main` describing what changed and why

---

## 📄 License

**Not detected from the current codebase** — no `LICENSE` file is present in either `backend/` or `frontend/`.

---

## 👤 Author

**PixelNoah** — Full-Stack Software Engineer, Addis Ababa, Ethiopia

- GitHub: [@PixelNoah-ui](https://github.com/PixelNoah-ui)

</div>
