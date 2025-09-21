import { createRouter, createWebHistory } from 'vue-router'
import HomeViews from '@/views/HomeViews.vue'
import CSSViews from '@/views/CSSViews.vue'
import JSView from '@/views/JSView.vue'
import VueView from '@/views/VueView.vue'
import DependenciesView from '@/views/DependenciesView.vue'
import LinksView from '@/views/LinksView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeViews,
    },
    {
      path: '/css',
      name: 'css',
      component: CSSViews,
    },
    {
      path: '/js',
      name: 'js',
      component: JSView,
    },
    {
      path: '/vue',
      name: 'vue',
      component: VueView,
    },
    {
      path: '/dependencies',
      name: 'dependencies',
      component: DependenciesView,
    },
    {
      path: '/links',
      name: 'links',
      component: LinksView,
    },
  ],
})

export default router
