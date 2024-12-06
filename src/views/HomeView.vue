<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/game'

const router = useRouter()
const gameStore = useGameStore()

const games = [
  {
    id: 'catch',
    title: 'Pepernoten Vangen',
    description: 'Help Piet om alle pepernoten te vangen!',
    icon: '🍪',
    route: '/catch'
  },
  {
    id: 'memory',
    title: 'Pakjes Memory',
    description: 'Vind alle matching pakjes!',
    icon: '🎁',
    route: '/memory'
  },
  {
    id: 'candy',
    title: 'Snoep Puzzel',
    description: 'Maak rijen van 3 of meer snoepjes!',
    icon: '🍬',
    route: '/candy'
  },
  {
    id: 'maze',
    title: 'Doolhof',
    description: 'Help Sinterklaas door het doolhof!',
    icon: '🎅',
    route: '/maze'
  },
  {
    id: 'jigsaw',
    title: 'Sinterklaas Puzzel',
    description: 'Maak de puzzel compleet!',
    icon: '🧩',
    route: '/jigsaw'
  }
]

const progress = computed(() => {
  return Math.round((gameStore.completedPuzzles.length / games.length) * 100)
})

watchEffect(() => {
  const allGamesCompleted = games.every(game => gameStore.isPuzzleCompleted(game.id))
  if (allGamesCompleted) {
    console.log('Alle spellen voltooid, navigeren naar victory pagina')
    router.push('/victory')
  }
})

const isPuzzleCompleted = (puzzleId: string) => {
  return gameStore.isPuzzleCompleted(puzzleId)
}
</script>

<template>
  <div class="text-center py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl mb-8">
        <span class="festive-icon">🎅</span>
            Welkom bij het sinterklaas puzzelspel
        <span class="festive-icon">🎁</span>
      </h1>
      
      <p class="text-xl mb-6 text-gray-700">
        Lieve Anneke, los deze spelletjes op om je cadeau te vinden!
      </p>

      <!-- Voortgangsbalk -->
      <div class="mb-12 max-w-md mx-auto">
        <div class="flex justify-between text-sm text-gray-600 mb-2">
          <span>Voortgang</span>
          <span>{{ progress }}%</span>
        </div>
        <div class="h-4 bg-gray-200 rounded-full overflow-hidden">
          <div 
            class="h-full bg-red-600 transition-all duration-500"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
        <div class="text-sm text-gray-600 mt-2">
          {{ gameStore.completedPuzzles.length }} van de {{ games.length }} puzzels opgelost
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <router-link 
          v-for="game in games" 
          :key="game.route"
          :to="game.route"
          class="game-card group relative"
          :class="{ 'completed-game': isPuzzleCompleted(game.id) }"
        >
          <!-- Completed badge -->
          <div 
            v-if="isPuzzleCompleted(game.id)"
            class="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg"
          >
            ✓
          </div>

          <div class="text-4xl mb-4">{{ game.icon }}</div>
          <h2 class="text-xl font-bold mb-2 text-red-700">{{ game.title }}</h2>
          <p class="text-gray-600">{{ game.description }}</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.completed-game {
  @apply border-green-500;
  background-color: rgba(239, 255, 239, 0.8);
}

.completed-game:hover {
  @apply border-green-600;
}
</style>