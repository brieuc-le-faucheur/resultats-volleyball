import { createRouter, createWebHistory } from 'vue-router'
import VolleyballDashboard from '../components/VolleyballDashboard.vue'
import CompactView from '../components/CompactView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: VolleyballDashboard
    },
    {
      path: '/compact',
      name: 'compact',
      component: CompactView
    }
  ]
})

export default router
