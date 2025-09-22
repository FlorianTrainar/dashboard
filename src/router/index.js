import { createRouter, createWebHistory } from 'vue-router'
import HomeViews from '@/views/HomeViews.vue'
import CSSViews from '@/views/CSSViews.vue'
import JSView from '@/views/JSView.vue'
import VueView from '@/views/VueView.vue'
import DependenciesView from '@/views/DependenciesView.vue'
import LinksView from '@/views/LinksView.vue'
import LoginView from '@/components/loginView.vue'

import { useAuth } from '@/assets/JS/useAuth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeViews,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/css',
      name: 'css',
      component: CSSViews,
      meta: { requiresAuth: true },
    },
    {
      path: '/js',
      name: 'js',
      component: JSView,
      meta: { requiresAuth: true },
    },
    {
      path: '/vue',
      name: 'vue',
      component: VueView,
      meta: { requiresAuth: true },
    },
    {
      path: '/dependencies',
      name: 'dependencies',
      component: DependenciesView,
      meta: { requiresAuth: true },
    },
    {
      path: '/links',
      name: 'links',
      component: LinksView,
      meta: { requiresAuth: true },
    },
  ],
})

// ✅ Attendre que Firebase ait chargé la session avant chaque navigation
router.beforeEach(async (to, from, next) => {
  const { user, authReady } = useAuth()
  await authReady // 👈 attend que Firebase ait répondu

  if (to.meta.requiresAuth && !user.value) {
    next({ name: 'login' }) // si non connecté, redirige
  } else {
    next() // sinon continue
  }
})

export default router
