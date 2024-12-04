import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/crossword',
      name: 'crossword',
      component: () => import('../views/CrosswordView.vue')
    },
    {
      path: '/sliding',
      name: 'sliding',
      component: () => import('../views/SlidingView.vue')
    },
    {
      path: '/memory',
      name: 'memory',
      component: () => import('../views/MemoryView.vue')
    },
    {
      path: '/maze',
      name: 'maze',
      component: () => import('../views/MazeView.vue')
    },
    {
      path: '/catch',
      name: 'catch',
      component: () => import('../views/CatchView.vue')
    },
    {
      path: '/quiz',
      name: 'quiz',
      component: () => import('../views/QuizView.vue')
    }
  ]
})

export default router