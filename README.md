# 🍔 Delishful — Food Delivery Website

A production-quality, portfolio-ready **Food Delivery Website** built with **React.js (ES6+)**, **HTML5**, **CSS3**, and modern CSS (Flexbox / Grid / Variables). It models the complete real-world food-ordering journey: **discover → search → browse menu → customize food → cart → coupon → address → delivery → payment (COD & mock online) → confirmation → live order tracking.**

![Stack](https://img.shields.io/badge/React-19-blue) ![Stack](https://img.shields.io/badge/React_Router-7-blue) ![Stack](https://img.shields.io/badge/Lucide_Icons-latest-orange) ![Stack](https://img.shields.io/badge/Vite-8-purple)

---

## ✨ Features

### Complete user journey (no dead buttons)
`Home → Search → Restaurants → Restaurant Menu → Food Details → Customize → Add to Cart → Cart → Coupon → Address → Delivery Option → Order Review → Payment → Confirmation → Tracking`

- **Home** — sticky header, animated hero with floating cards, cuisine strip, trending dishes, top restaurants, offers, recommendations, "how it works", testimonials, download-app section, newsletter, footer.
- **Restaurant discovery** — 8 restaurants with live filtering (cuisine, rating, price, delivery time, veg-only, offers) and sorting (recommended, rating, fastest, price).
- **Restaurant menu** — cover/logo, ratings, sticky category navigation, food cards with veg/non-veg + bestseller badges.
- **Food modal** — size (Regular/Large/XL), add-ons (extra cheese, sauce, fries…), special instructions ("less spicy", "no onions"), live price calculation, quantity selector.
- **Cart** — quantities, customizations, remove/clear, dynamic bill (item total, delivery, tax, discount, grand total), sticky mobile checkout bar.
- **Coupons** — `WELCOME50`, `FOOD20`, `FIRSTORDER`, `SAVE100` with real validation logic (flat/percent/min-order/duplicate/invalid).
- **Checkout** — 3-step wizard: Address (save/validate) → Delivery (Standard / Priority / Scheduled) → Review.
- **Payment** — polished interface with **Cash on Delivery** and **Online** (UPI, Card with realistic formatting, Net Banking, Wallet). Mock processing animation, transaction + order ID generation. **No real card data is ever stored.**
- **Order tracking** — animated 6-step timeline with simulated live status updates.

### Tech & quality
- React Context (Cart + Order state), LocalStorage persistence (non-sensitive only)
- Code-split / lazy-loaded routes, loading skeletons, toasts, page transitions
- Full responsive design (320px → 1440px+), no horizontal overflow
- WCAG-friendly: semantic HTML, ARIA labels, focus states, error messages, `prefers-reduced-motion` support
- SEO: per-route titles + meta descriptions, semantic headings, alt text, structured content
- Unique branding: **Midnight Navy `#101828` · Coral `#FF6B35` · Golden Yellow `#FFC857` · Cream `#FFF8F0` · Fresh Green `#22C55E`**

---

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+** and npm

### 1. Install dependencies
```bash
npm install
```

### 2. Run in development
```bash
npm run dev
```
Open the printed URL (default `http://localhost:5173`).

### 3. Build for production
```bash
npm run build      # outputs optimized bundle to /dist
npm run preview    # serve the production build locally
```

### 4. Lint
```bash
npm run lint
```

---

## ⚙️ Backend (Node.js + Express + MongoDB)

The frontend now talks to a REST API served from `server/`. It serves restaurants,
foods, cuisines, coupons, and handles **user auth (JWT)**, **server-side carts**, and
**orders** — with graceful fallback to local data if the backend is offline.

### Backend prerequisites
- **Node.js 18+** and npm
- **MongoDB** running locally (default `mongodb://127.0.0.1:27017`)

### 1. Start MongoDB
```bash
# Ubuntu/Debian
sudo systemctl start mongod
# or run it manually
mongod --dbpath ~/data/db
```

### 2. Configure environment
```bash
cp server/.env.example server/.env
# edit server/.env and set a strong JWT_SECRET
```

### 3. Install dependencies & seed the database
```bash
npm install
npm run seed        # loads restaurants, foods & coupons into MongoDB
```

### 4. Run
```bash
npm run server:dev        # backend on http://localhost:5000 (nodemon)
npm run dev               # frontend on http://localhost:5173 (separate terminal)
# OR run both together:
npm run dev:all
```

### API overview
| Method | Endpoint | Description | Auth |
| ------ | -------- | ----------- | ---- |
| POST | `/api/auth/register` | Create account | — |
| POST | `/api/auth/login` | Login → JWT token | — |
| GET/PUT | `/api/auth/profile` | View / update profile | ✅ |
| GET | `/api/restaurants` | List restaurants (+ `?cuisine=&search=`) | — |
| GET | `/api/restaurants/:id` · `/api/restaurants/:id/foods` | Restaurant + menu | — |
| GET | `/api/foods` · `/api/foods/:id` | All foods / single food (+ `?search=` `?restaurantId=`) | — |
| GET | `/api/cuisines` | Distinct cuisines | — |
| GET/POST | `/api/coupons` · `/api/coupons/validate` | List / validate a coupon | — |
| GET/POST/PUT/DELETE | `/api/cart` | Server-side cart | ✅ |
| POST | `/api/orders` | Place order (computes totals server-side) | ✅ |
| GET | `/api/orders` · `/api/orders/:id` | My orders / one order | ✅ |
| GET | `/api/orders/track/:orderId` | Track order status | ✅ |

> **Guest mode:** without logging in, the app still runs fully using local data +
> LocalStorage cart, matching the original demo behaviour. Login / Register pages
> enable the backend-synced cart and real order placement.

---

## 🧭 Try the full flow

1. Pick any food card on the home page (or search "pizza" / "biryani").
2. Open the food, choose size + add-ons, set quantity, **Add to Cart**.
3. Go to cart → apply coupon `WELCOME50` or `FOOD20`.
4. **Proceed to Checkout** → add/select address → choose delivery → review.
5. **Continue to Payment** → pick **Cash on Delivery** (confirm) *or* **UPI/Card/NetBanking/Wallet** (watch the mock processing).
6. Land on **Order Confirmed** (confetti 🎉) → **Track Order** and watch the live status timeline march to "Delivered".

---

## 📦 Project Structure

```
server/              Node.js + Express REST API (MongoDB)
├── config/          db.js — MongoDB connection
├── models/          User, Restaurant, Food, Coupon, Cart, Order (Mongoose)
├── controllers/     auth, restaurant, coupon, cart, order logic
├── routes/          API route definitions
├── middleware/      JWT auth + central error handler
├── seed.js          Seeds restaurants/foods/coupons from src/data
└── server.js        Express app entry point

src/
├── api/             api/client.js (fetch wrapper) + api/index.js (REST endpoints)
├── components/      Navbar, Footer, FoodCard, FoodModal, RestaurantCard,
│                    SearchBar, CartItem, CouponBox, AddressForm,
│                    PaymentMethod, OrderSummary, OrderTracker, Toast, LoadingSpinner
├── pages/           Home, Restaurants, RestaurantDetails, Cart, Checkout,
│                    Payment, OrderSuccess, TrackOrder, Offers, About,
│                    Login, Register
├── context/         AuthContext, DataContext, CartContext, OrderContext
├── data/            Local fallback data (used when backend is offline)
├── utils/           priceCalculator.js, validation.js, orderGenerator.js
├── styles/          variables.css, global.css, animations.css, responsive.css
├── App.jsx          Router + route-level lazy loading + per-route SEO
└── main.jsx
```

---

## 🔐 Privacy note
This is a **frontend demo**. Payment is fully mocked — no real gateway is contacted and **no card number, CVV, or banking credentials** are persisted. UPI/Card/bank fields are validated only.

---

## 🛠️ Tech stack
React 19 · Vite 8 · React Router 7 · Lucide React · React Context + useReducer · LocalStorage · CSS3 (Flexbox/Grid/Variables/Animations)

---

Made with ❤️ for food lovers & hungry developers.