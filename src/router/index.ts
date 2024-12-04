import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CrosswordView from '../views/CrosswordView.vue'
import SlidingView from '../views/SlidingView.vue'
import MazeView from '../views/MazeView.vue'
import CatchView from '../views/CatchView.vue'
import CandyView from '../views/CandyView.vue'
import MemoryView from '../views/MemoryView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/crossword',
      name: 'crossword',
      component: CrosswordView
    },
    {
      path: '/sliding',
      name: 'sliding',
      component: SlidingView
    },
    {
      path: '/maze',
      name: 'maze',
      component: MazeView
    },
    {
      path: '/catch',
      name: 'catch',
      component: CatchView
    },
    {
      path: '/candy',
      name: 'candy',
      component: CandyView
    },
    {
      path: '/memory',
      name: 'memory',
      component: MemoryView
    }
  ]
})

export default router