import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/thankyou',
      name: 'thankyou',
      component: () => import('../views/ThankyouView.vue')
    },
    {
      path: '/notes',
      name: 'notes',
      component: () => import('../views/panel/Notes.vue')
    },
    {
      path: '/drive',
      name: 'drive',
      component: () => import('../views/panel/Drive.vue')
    },
    {
      path: '/notes/share/:hash',
      name: 'sharedNote',
      component: () => import('../views/other/SharedNoteView.vue')
    }
  ]
})

export default router
