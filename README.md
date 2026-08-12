<h1 align="center">🛍️ Shofipy — Frontend E-Commerce</h1>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Redux_Toolkit-2-764ABC?style=for-the-badge&logo=redux&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Stripe-Integrated-635BFF?style=for-the-badge&logo=stripe&logoColor=white" />
</p>

<p align="center">
  Modern, full-featured e-commerce frontend built with React 19 and Vite — supporting customers, staff, and admin roles in a unified interface.
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Routing](#-routing)
- [State Management](#-state-management)
- [API Integration](#-api-integration)
- [Authentication Flow](#-authentication-flow)
- [License](#-license)

---

## 🌟 Overview

**Shofipy** is the frontend of a full-stack e-commerce platform. It connects to a Spring Boot backend and provides a rich shopping experience for customers, along with dedicated dashboards for staff and administrators.

**Live Backend API:** `https://ecommerce-sb-backend.onrender.com`

---

## ✨ Features

### 🛒 Customer
- Browse and search products with filtering
- View detailed product pages
- Shopping cart management (persisted in `localStorage`)
- Secure checkout with **Stripe** payment integration
- Order history tracking
- User profile management
- Address management with Country/State/City selector

### 🔐 Authentication
- Register / Login / Logout
- Forgot password & Reset password via email
- JWT-based auth with **silent token refresh** (access token auto-renewed via refresh token in HttpOnly cookie)

### 🧑‍💼 Staff Dashboard
- Manage products and catalog
- Process and update orders
- View user accounts

### 👑 Admin Dashboard
- Full product & category management
- Order management
- Refund processing
- User role management
- Analytics & statistics overview

### 📄 Info Pages
- FAQ, Returns Policy, Privacy Policy

---

## 🛠 Tech Stack

| Category | Technology |
|---|---|
| Framework | React 19 |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS v4 |
| UI Components | MUI (Material UI v7), Headless UI |
| Icons | Lucide React, React Icons, MUI Icons |
| State Management | Redux Toolkit + React Redux |
| Routing | React Router DOM v7 |
| HTTP Client | Axios (with interceptors) |
| Payment | Stripe (`@stripe/react-stripe-js`) |
| Forms | React Hook Form |
| Animations | Motion (Framer Motion v12) |
| Charts | Recharts |
| Carousel / Slider | Swiper |
| Notifications | React Toastify |
| Geo Selector | country-state-city |

---

## 📁 Project Structure

```
Shofipy-Frontend-EC/
├── public/                   # Static assets
├── src/
│   ├── api/
│   │   └── api.js            # Axios instance with JWT interceptors
│   ├── assets/               # Images, fonts, etc.
│   ├── components/
│   │   ├── about/            # About page
│   │   ├── admin/            # Admin dashboard & sub-panels
│   │   │   ├── catalog/
│   │   │   ├── dashboard/
│   │   │   ├── orders/
│   │   │   ├── product/
│   │   │   ├── refunds/
│   │   │   └── users/
│   │   ├── auth/             # Login, Register, ForgotPassword, ResetPassword
│   │   ├── cart/             # Shopping cart
│   │   ├── checkout/         # Multi-step checkout (summary, payment method, Stripe form)
│   │   ├── contact/          # Contact page
│   │   ├── home/             # Landing/home page
│   │   ├── hooks/            # Custom React hooks
│   │   ├── info/             # FAQ, Returns, Policy pages
│   │   ├── orders/           # My Orders page
│   │   ├── products/         # Product listing & detail pages
│   │   ├── profile/          # User profile
│   │   ├── shared/           # Shared components (PrivateRoute, Navbar, Footer...)
│   │   ├── staff/            # Staff dashboard & sub-panels
│   │   │   ├── dashboard/
│   │   │   ├── orders/
│   │   │   ├── product/
│   │   │   └── users/
│   │   └── utils/            # ScrollToTop, ScrollToTopButton, helpers
│   ├── store/
│   │   ├── actions/
│   │   │   └── index.js      # All Redux thunk actions
│   │   ├── reducers/
│   │   │   ├── AuthReducer.js
│   │   │   ├── CartReducer.js
│   │   │   ├── ErrorReducer.js
│   │   │   ├── PaymentMethodReducer.js
│   │   │   └── ProductReducer.js
│   │   └── store.js          # Redux store configuration
│   ├── App.jsx               # Root component with route definitions
│   ├── main.jsx              # React entry point
│   ├── App.css
│   └── index.css
├── .env                      # Environment variables (not committed)
├── vite.config.js
├── eslint.config.js
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** >= 9

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/Shofipy-Frontend-EC.git
cd Shofipy-Frontend-EC

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env
# Then fill in the values (see Environment Variables section)

# 4. Start development server
npm run dev
```

The app will be available at **http://localhost:5173**

### Other Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local development server with HMR |
| `npm run build` | Build for production (`/dist`) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint checks |

---

## 🔑 Environment Variables

Create a `.env` file at the project root with the following variables:

```env
# URL of the Spring Boot backend
VITE_BACK_END_URL=https://ecommerce-sb-backend.onrender.com

# Stripe publishable key (test or live)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

> **Note:** All Vite environment variables must be prefixed with `VITE_` to be accessible in the browser.

---

## 🗺 Routing

| Path | Component | Access |
|---|---|---|
| `/` | `Home` | Public |
| `/products` | `Products` | Public |
| `/products/product/:id` | `ProductDetail` | Public |
| `/about` | `About` | Public |
| `/contact` | `Contact` | Public |
| `/cart` | `Cart` | Public |
| `/faq` | `FAQ` | Public |
| `/returns` | `Returns` | Public |
| `/policy` | `Policy` | Public |
| `/signin` | `Login` | Guest only |
| `/register` | `Register` | Guest only |
| `/forgot-password` | `ForgotPassword` | Public |
| `/reset-password` | `ResetPassword` | Public |
| `/checkout` | `CheckOut` | 🔒 Authenticated |
| `/profile` | `UserProfile` | 🔒 Authenticated |
| `/my-orders` | `MyOrder` | 🔒 Authenticated |
| `/admin` | `AdminDashboard` | 🔒 Admin only |
| `/staff` | `StaffDashboard` | 🔒 Staff only |

---

## 🗄 State Management

Redux Toolkit is used for global state, organized into 5 slices:

| Slice | Responsibility |
|---|---|
| `auth` | User session, access token, login/logout |
| `carts` | Cart items, cart ID, total price |
| `products` | Product list, filters, pagination |
| `errors` | Global error state |
| `payment` | Selected payment method |

Cart items and the authenticated user are **persisted in `localStorage`** and rehydrated as `preloadedState` on app start.

---

## 🔌 API Integration

All HTTP requests go through a centralized **Axios instance** (`src/api/api.js`) that:

1. **Injects the JWT access token** automatically from Redux state into the `Authorization: Bearer <token>` header.
2. **Silently refreshes** the access token on `401` responses using the refresh token (stored as an HttpOnly cookie), then retries the original request.
3. **Logs out** the user automatically if the refresh attempt also fails.

---

## 🔐 Authentication Flow

```
User logs in
    └─> Access token saved in Redux (memory)
    └─> Refresh token saved as HttpOnly cookie (server-side)
    └─> User info saved in localStorage

On each request:
    └─> Axios interceptor attaches access token to Authorization header

On 401 response:
    └─> Interceptor calls POST /auth/refresh
    └─> New access token stored in Redux
    └─> Original request retried automatically

On app load:
    └─> App dispatches renewAccessToken() if a user session exists
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

<p align="center">Made with ❤️ using React + Vite</p>
