<div align="center">

<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:0F766E,100:14B8A6&height=180&section=header&text=PixelShop&fontSize=55&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Full-Stack%20Electronics%20Storefront&descAlignY=58&descSize=18"/>

# 🛒 PixelShop — Full-Stack Electronics Storefront

<img src="https://readme-typing-svg.demolab.com/?font=Fira+Code&weight=600&size=20&duration=2500&pause=900&color=14B8A6&center=true&vCenter=true&width=680&lines=Next.js+%2B+Express+%2B+Prisma+%2B+PostgreSQL;Google+%26+Email%2FPassword+Auth;Role-Based+Admin+Tooling;Chapa+Payments+for+the+Ethiopian+Market" alt="Typing SVG" />

**A production e-commerce platform (Next.js frontend + Express/Prisma backend) with Google & email/password auth, role-based admin tooling, and Chapa payment integration for the Ethiopian market.**

[![GitHub Repo](https://img.shields.io/badge/GitHub-PixelNoah--ui%2FE--commerce-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/PixelNoah-ui/E-commerce)
[![License](https://img.shields.io/badge/License-Not%20detected-lightgrey?style=for-the-badge)](#-license)

![Next.js](https://img.shields.io/badge/Next.js-16.2-000000?style=flat-square&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express%205-339933?style=flat-square&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma%207-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Chapa](https://img.shields.io/badge/Payments-Chapa-1e90ff?style=flat-square)
![Deploy](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel&logoColor=white)

**[🔗 Live Demo](http://pixelshops.vercel.app/)**

</div>

---

## 📖 Overview

A **two-package monorepo** — `frontend/` (Next.js 16) and `backend/` (Express 5 + Prisma 7 + PostgreSQL) — for an electronics storefront targeting Ethiopia (ETB currency, Ethiopian phone validation). It has a real checkout pipeline (server-side validation → **Chapa** payment → idempotent order creation), two parallel auth systems (Google for customers, email/password for staff), and a role-gated back office for products, orders, and staff.


> It also has a practical consequence: the backend's CORS allow-list only permits `pixelshops.vercel.app` / `pixelshopadmin.vercel.app`, API calls from the live demo above may be blocked by CORS.

---

## 🖼️ Screenshots

<table>
<tr>
<td width="33%"><img src="docs/screenshots/home.png" width="100%"><p align="center"><sub>Home</sub></p></td>
<td width="33%"><img src="docs/screenshots/products.png" width="100%"><p align="center"><sub>Equipment catalog</sub></p></td>
<td width="33%"><img src="docs/screenshots/myorder.png" width="100%"><p align="center"><sub>My Orders</sub></p></td>
</tr>
</table>



---

## ✨ Features

**Customer:** browse/search/filter/sort products, product detail pages, reviews (one per user/product), wishlist, persistent cart (`localStorage`), multi-address checkout with **Chapa** payment, order history + receipts, profile settings, contact form.

**Admin/Manager (backend only — no admin frontend exists in this repo):** dashboard stats, product CRUD with Cloudinary image processing, manager account management, business-address management, order status updates.

**Auth:** Google Sign-In *or* email/password, sharing one `User` table (`role: ADMIN | MANAGER | USER`). JWT in an httpOnly cookie, 7-day expiry, bcrypt hashing, lockout after 5 failed logins.

**Payments:** Chapa only — hosted checkout redirect, server-to-server verification, optional webhook signature check. No Stripe/PayPal or manual bank-transfer flow here.

---

## 🧰 Tech Stack

<div align="center">

![Next.js](https://skillicons.dev/icons?i=nextjs) ![React](https://skillicons.dev/icons?i=react) ![TypeScript](https://skillicons.dev/icons?i=typescript) ![TailwindCSS](https://skillicons.dev/icons?i=tailwind) ![NodeJS](https://skillicons.dev/icons?i=nodejs) ![Express](https://skillicons.dev/icons?i=express) ![PostgreSQL](https://skillicons.dev/icons?i=postgres) ![Prisma](https://skillicons.dev/icons?i=prisma) ![Vercel](https://skillicons.dev/icons?i=vercel)

</div>

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, shadcn/ui, TanStack Query, Framer Motion |
| Backend | Express 5, TypeScript, Prisma 7 + `@prisma/adapter-pg` over PostgreSQL |
| Auth | JWT (`jsonwebtoken`) + `bcryptjs`; Google ID-token verification via `google-auth-library` |
| Payments | Chapa (custom fetch integration) |
| Images | `multer` → `sharp` (resize/WebP) → Cloudinary |
| Email | `nodemailer` |
| Security | `helmet`, `express-rate-limit`, `cors`, `cookie-parser` |
| Deploy (inferred) | Vercel — no `vercel.json`/Dockerfile in repo |

`passport` / `passport-google-oauth20` are installed but unused — Google auth goes through `google-auth-library` directly instead.

---

## 🏗️ Architecture

```mermaid
flowchart LR
    subgraph FE["frontend (Next.js)"]
        UI["App Router pages"]
        Cart["CartProvider (localStorage)"]
    end
    subgraph BE["backend (Express)"]
        Routers["/api/v1/* routers"]
        Auth["AuthController"]
        Ctrls["Controllers"]
    end
    subgraph Ext["External services"]
        PG[("PostgreSQL")]
        Cloudinary["Cloudinary"]
        Chapa["Chapa"]
        Google["Google OAuth"]
    end

    UI --> Routers
    Cart --> UI
    Routers --> Ctrls
    Ctrls --> Auth
    Ctrls --> PG
    Ctrls --> Cloudinary
    Ctrls --> Chapa
    Auth --> Google
```

**Checkout flow:** cart validate → create `CheckoutSession` → initialize Chapa payment → redirect to hosted checkout → Chapa callback verifies → transaction creates `Order` + `OrderItem`s + `Payment`, decrements stock.

```mermaid
sequenceDiagram
    participant U as User
    participant API as Backend
    participant Chapa as Chapa

    U->>API: POST /checkout/validate
    API-->>U: subtotal / tax / total
    U->>API: POST /checkout/initialize
    API->>Chapa: initialize payment
    Chapa-->>API: checkout_url
    API-->>U: redirect to Chapa
    Chapa->>API: callback (tx_ref, status)
    API->>Chapa: verify(tx_ref)
    API->>API: create Order + Payment, decrement stock
```

**Entity relationships:**

```mermaid
erDiagram
    USER ||--o{ USERADDRESS : has
    USER ||--o{ ORDER : places
    USER ||--o{ REVIEW : writes
    USER ||--o{ WISHLISTITEM : saves
    PRODUCT ||--o{ ORDERITEM : "sold as"
    PRODUCT ||--o{ REVIEW : receives
    ORDER ||--o{ ORDERITEM : contains
    ORDER ||--o| PAYMENT : "paid via"

    USER {
        string id PK
        string email UK
        string googleId UK
        enum role
    }
    PRODUCT {
        string id PK
        decimal price
        string categoryType
        string sku UK
        boolean isActive
    }
    ORDER {
        string id PK
        string orderNumber UK
        enum status
        enum paymentStatus
    }
    PAYMENT {
        string id PK
        string orderId FK, UK
        string provider
        enum status
    }
```

---

## 📁 Folder Structure

```text
E-commerce/
├── backend/
│   ├── prisma/schema.prisma        # Data model
│   └── src/
│       ├── controller/             # auth, products, orders, addresses, dashboard, managers, owner
│       ├── router/                 # one router per resource, mounted under /api/v1
│       ├── middleware/             # auth (restrictTo), upload (multer+sharp+cloudinary)
│       ├── services/                # chapaService.ts, notificationService.ts
│       └── index.ts / server.ts
└── frontend/
    └── src/
        ├── app/                    # equipments, products/[id], checkout, orders, profile, about, contact
        ├── components/             # cart, layout, orders, profile, reviews, ui (shadcn)
        ├── hooks/                  # useCart, useOrders, useProducts, useGoogleLogin...
        └── middleware.ts           # route guard by cookie presence
```

---

## ⚙️ Installation

```bash
git clone https://github.com/PixelNoah-ui/E-commerce.git
cd E-commerce

# Backend
cd backend
npm install
cp .env.example .env         # fill in values — see below
npm run generate              # prisma generate
npx prisma migrate deploy
npm run dev                   # http://localhost:8000

# Frontend (separate terminal)
cd ../frontend
npm install
cp .env.example .env.local
npm run dev                   # http://localhost:3000
```

---

## 🔑 Environment Variables

**`backend/.env`**
```bash
PORT=8000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@host:5432/dbname

JWT_SECRET=your_jwt_signing_secret
GOOGLE_CLIENT_ID=your_google_oauth_client_id

CHAPA_SECRET_KEY=your_chapa_secret_key
CHAPA_CALLBACK_URL=https://your-api-domain.com/api/v1/checkout/chapa/callback
CHAPA_RETURN_URL=https://your-frontend-domain.com/checkout/success

CLIENT_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_HOST=your_smtp_service_name
EMAIL_USERNAME=your_email_address
EMAIL_PASSWORD=your_email_password_or_app_password
ADMIN_EMAIL=owner@example.com   # optional
```

**`frontend/.env.local`**
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id
NEXT_PUBLIC_CURRENCY_CODE=ETB
NEXT_PUBLIC_CURRENCY_DISPLAY=symbol
```

> Production auth cookies are hard-coded to domain `.abdulectroncs.com` in `AuthController.ts` — not read from an env var, so a different deployment domain needs a code change.

---

## 🗄️ Database

PostgreSQL via Prisma 7. Core models: `User` (role enum: `ADMIN`/`MANAGER`/`USER`), `UserAddress`, `Product`, `Review`, `WishlistItem`, `Order` → `OrderItem`, `Payment`, `CheckoutSession` (holds pending Chapa state), `OwnerAddress` (single-row business info). See the ER diagram above for relationships.

**Not implemented:** a `Coupon` table. The frontend has a `useTodayCoupon()` hook calling `GET /coupons/today`, but no matching model, controller, or route exists anywhere in the backend — it's dead code that will always 404.

---

## 📡 API Summary

Base path `/api/v1`, mounted in `backend/src/index.ts`:

| Resource | Routes | Notes |
|---|---|---|
| `/auth` | signup, login, google, forgot/reset-password, me, logout, update-password | ⚠️ `update-password` is accidentally ADMIN-only — see below |
| `/products` | list, new-arrivals, get, create, update, delete, admin-products | ⚠️ create + admin-products aren't role-restricted — see below |
| `/orders` | list mine, update status | ⚠️ update has no ownership/role check — see below |
| `/checkout` | validate, initialize, order lookup, Chapa callback | Callback is the public Chapa webhook |
| `/addresses` | full CRUD + set-default | Ownership-checked |
| `/customer` | reviews CRUD, wishlist add/remove/list | Ownership-checked |
| `/dashboard` | stats by period | ⚠️ no role restriction |
| `/managers` | staff CRUD | ADMIN-only throughout |
| `/ownerAddress` | read (public), write (ADMIN) | |
| `/contact/messages` | send | Public, validated |

---

## 🔐 Authentication

Two paths into one `User` table: **Google Sign-In** (verified via `google-auth-library`, auto-creates/links a user) and **email/password** (bcrypt cost 12, 5-attempt lockout for 15 min). Sessions are a 7-day JWT in an httpOnly cookie, with `Authorization: Bearer` accepted as a fallback. The frontend's `middleware.ts` only checks whether the `token` cookie *exists* — real verification happens on the backend for every protected API call.

---

## 🌍 Deployment

Frontend on Vercel (per CORS origins), no `vercel.json`. Backend has no Dockerfile or platform config — host isn't detectable from the repo. PostgreSQL via `DATABASE_URL`. No CI/CD (`no .github/workflows` in either package).

---

## 🛡️ Security

**In place:** `helmet`, CORS allow-list, rate limiting (100 req/15min), bcrypt + lockout, httpOnly JWT cookies, ownership checks on addresses/reviews/wishlist, optional Chapa webhook HMAC verification.

**Gap:** the Chapa signature check silently *passes* if `CHAPA_SECRET_KEY` or the signature header is missing, instead of failing closed — a misconfigured deployment would accept unverified payment callbacks.

---



## 🔭 Next Steps

1. Fix the two authorization gaps in `orderRouter.ts` and `productRouter.ts` — highest priority
2. Fix `/update-password`'s role restriction
3. Resolve the coupon dead-code and stock-concurrency gap
4. Parameterize branding/cookie-domain instead of hard-coding
5. Add tests + CI, add a `LICENSE`

---

## 🤝 Contributing

Fork → branch → `npm install` in both `backend/` and `frontend/` → run `npm run generate` after any Prisma schema change → match existing `catchAsync`/`AppError` patterns → open a PR. If your change touches a route's auth, double-check middleware ordering (see the audit above for why).

---

## 📄 License

Not detected — no `LICENSE` file in the repo.

---

## 👤 Author

**PixelNoah** — Addis Ababa, Ethiopia — [@PixelNoah-ui](https://github.com/PixelNoah-ui)

<div align="center">

<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:0F766E,100:14B8A6&height=120&section=footer&animation=fadeIn"/>

</div>
