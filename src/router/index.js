import { createRouter, createWebHistory } from 'vue-router'
import HomeViews from '@/views/HomeViews.vue'
import CSSViews from '@/views/CSSViews.vue'
import JSView from '@/views/JSView.vue'
import VueView from '@/views/VueView.vue'
import DependenciesView from '@/views/DependenciesView.vue'
import LinksView from '@/views/LinksView.vue'

import { getAuth, onAuthStateChanged } from 'firebase/auth'
import LoginView from '@/components/loginView.vue'

const auth = getAuth()

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

router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth // mets cette meta dans tes routes privées

  if (requiresAuth) {
    const user = auth.currentUser
    if (user) {
      next()
    } else {
      next({ name: 'login' }) // ou le nom de ta page de connexion
    }
  } else {
    next()
  }
})
export default router
