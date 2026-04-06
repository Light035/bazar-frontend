import { createRouter, createWebHistory } from 'vue-router'
import { authService } from '@/services'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomePage.vue'),
  },
  {
    path: '/catalog',
    name: 'catalog',
    component: () => import('@/views/CatalogPage.vue'),
  },
  {
    path: '/product/:slug',
    name: 'product',
    component: () => import('@/views/ProductPage.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginPage.vue'),
    meta: { guest: true },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterPage.vue'),
    meta: { guest: true },
  },
  {
    path: '/email-verification',
    name: 'email-verification',
    component: () => import('@/views/EmailVerificationPage.vue'),
    meta: { guest: true },
  },
  {
    path: '/verify-email/:token',
    name: 'verify-email',
    component: () => import('@/views/EmailVerifiedPage.vue'),
    meta: { guest: true },
  },
  {
    path: '/password-reset',
    name: 'password-reset',
    component: () => import('@/views/PasswordResetPage.vue'),
    meta: { guest: true },
  },
  {
    path: '/password-reset/confirm/:token',
    name: 'password-reset-confirm',
    component: () => import('@/views/PasswordResetConfirmPage.vue'),
    meta: { guest: true },
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('@/views/CartPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/wishlist',
    name: 'wishlist',
    component: () => import('@/views/WishlistPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/orders',
    name: 'orders',
    component: () => import('@/views/OrdersPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfilePage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/seller',
    name: 'seller',
    component: () => import('@/views/SellerPage.vue'),
    meta: { requiresAuth: true, requiresSeller: true },
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const isAuthenticated = authService.isAuthenticated()

  // Redirect authenticated users away from guest pages
  if (to.meta.guest && isAuthenticated) {
    return next({ name: 'home' })
  }

  // Redirect unauthenticated users to login
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ name: 'login', query: { redirect: to.fullPath } })
  }

  next()
})

export default router

