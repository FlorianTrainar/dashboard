import { createRouter, createWebHistory } from 'vue-router'
import HomeViews from '@/views/HomeViews.vue'
import FloboardViews from '@/views/FloboardViews.vue'

import VueView from '@/views/VueView.vue'
import LinksView from '@/views/LinksView.vue'

import { useAuth } from '@/assets/JS/useAuth'
import LanguagesView from '@/views/LanguagesView.vue'
import NotebookView from '@/views/NotebookView.vue'
import ReactViews from '@/views/ReactViews.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeViews,
    },
    {
      path: '/floboard',
      name: 'floboard',
      component: FloboardViews,
      meta: { requiresAuth: true },
    },

    {
      path: '/react',
      name: 'react',
      component: ReactViews,
      meta: { requiresAuth: true },
    },

    {
      path: '/vue',
      name: 'vue',
      component: VueView,
      meta: { requiresAuth: true },
    },
    {
      path: '/languages',
      name: 'languages',
      component: LanguagesView,
      meta: { requiresAuth: true },
    },
    {
      path: '/notebook',
      name: 'notebook',
      component: NotebookView,
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
    next({ name: 'home' }) // si non connecté, redirige
  } else {
    next() // sinon continue
  }
})

export default router
