import { createRouter, createWebHistory } from 'vue-router'
import VolleyballDashboard from '../components/VolleyballDashboard.vue'
import CompactView from '../components/CompactView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/compact'
    },
    {
      path: '/compact',
      name: 'compact',
      component: CompactView
    },
    {
      path: '/full',
      name: 'dashboard',
      component: VolleyballDashboard
    }
  ]
})

export default router
