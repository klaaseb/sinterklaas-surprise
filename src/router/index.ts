import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SlidingView from '../views/SlidingView.vue'
import MazeView from '../views/MazeView.vue'
import CatchView from '../views/CatchView.vue'
import CandyView from '../views/CandyView.vue'
import MemoryView from '../views/MemoryView.vue'
import VictoryView from '../views/VictoryView.vue'
import { useGameStore } from '../stores/game'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/catch',
      name: 'catch',
      component: CatchView
    },
    {
      path: '/memory',
      name: 'memory',
      component: MemoryView
    },
    {
      path: '/candy',
      name: 'candy',
      component: CandyView
    },
    {
      path: '/maze',
      name: 'maze',
      component: MazeView
    },
    {
      path: '/sliding',
      name: 'sliding',
      component: SlidingView
    },
    {
      path: '/victory',
      name: 'victory',
      component: VictoryView,
      beforeEnter: (to, from, next) => {
        const gameStore = useGameStore()
        const allGames = ['catch', 'memory', 'candy', 'maze', 'sliding']
        const allCompleted = allGames.every(game => gameStore.isPuzzleCompleted(game))
        
        if (allCompleted) {
          next()
        } else {
          next('/')
        }
      }
    },
    {
      path: '/reset-progress',
      name: 'reset',
      redirect: '/',
      beforeEnter: (to, from, next) => {
        const gameStore = useGameStore()
        gameStore.resetProgress()
        next('/')
      }
    }
  ]
})

export default router