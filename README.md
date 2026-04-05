# Bazar Frontend - Vue.js 3 E-Commerce

Modern e-commerce frontend built with Vue 3, Pinia, and Tailwind CSS.

## Tech Stack

- Vue 3 (Composition API)
- Pinia (State Management)
- Vue Router
- Axios (API calls)
- Tailwind CSS
- Vite

## Features Implemented

✅ JWT Authentication with auto-refresh
✅ Product catalog with filters and search
✅ Shopping cart management
✅ Responsive Navbar with cart counter
✅ Product cards with ratings
✅ Login/Register pages
✅ Modern Kaspi.kz-inspired design

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run serve
```

3. Make sure Django backend is running at http://127.0.0.1:8000

## Project Structure

```
src/
├── assets/          # CSS and static files
├── components/      # Reusable components
│   ├── Navbar.vue
│   └── ProductCard.vue
├── views/           # Page components
│   ├── HomePage.vue
│   ├── CatalogPage.vue
│   ├── CartPage.vue
│   ├── LoginPage.vue
│   └── RegisterPage.vue
├── stores/          # Pinia stores
│   ├── auth.js
│   ├── cart.js
│   └── product.js
├── services/        # API services
│   ├── api.js
│   └── index.js
└── router/          # Vue Router config
    └── index.js
```

## Remaining Pages to Implement

- ProductPage (product detail with reviews)
- OrdersPage (order history)
- ProfilePage (user profile + become seller)
- SellerPage (seller dashboard)

## API Endpoints

Backend API: http://127.0.0.1:8000/api/

- Auth: /auth/login/, /auth/register/, /auth/me/
- Products: /products/, /categories/
- Cart: /cart/
- Orders: /orders/

## Color Scheme

Primary: Red/Orange (#ed1c24)
Background: White/Gray-50
Cards: White with shadow
