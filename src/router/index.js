import { createRouter, createWebHistory } from 'vue-router'
import HomeViews from '@/views/HomeViews.vue'

import { useAuth } from '@/assets/JS/useAuth'

import ClientAdminView from '@/views/ClientAdminView.vue'
import DdcoreenAdminView from '@/views/clients/DdcoreenAdminView.vue'

import DashboardView from '@/views/DashboardView.vue'

// Legacy

import SnippetView from '@/views/SnippetView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeViews,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: '/snippet',
      name: 'snippet',
      component: SnippetView,
      meta: { requiresAuth: true },
    },

    {
      path: '/client-admin',
      name: 'client-admin',
      component: ClientAdminView,
      meta: { requiresAuth: true },
    },

    {
      path: '/ddcoreen-admin',
      name: 'ddcoreen-admin',
      component: DdcoreenAdminView,
      meta: { requiresAuth: true },
    },
  ],
})

// ✅ Attendre que Firebase ait chargé la session avant chaque navigation
router.beforeEach(async (to, from, next) => {
  const { user, authReady } = useAuth()
  await authReady // 👈 attend que Firebase ait répondu

  if (to.meta.requiresAuth && !user.value) {
    next({ name: 'home' }) // si non connecté, redirige
  } else {
    next() // sinon continue
  }
})

export default router
