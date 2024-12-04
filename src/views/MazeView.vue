<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/game'
import MazeGrid from '../components/MazePuzzle/MazeGrid.vue'

const router = useRouter()
const gameStore = useGameStore()
const showReward = ref(false)

const handlePuzzleComplete = () => {
  gameStore.completePuzzle('maze')
  showReward.value = true
  
  setTimeout(() => {
    router.push('/memory') // Of een andere route
  }, 3000)
}
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-6 text-center">
      Sinterklaas Doolhof
    </h1>
    
    <MazeGrid @puzzle-completed="handlePuzzleComplete" />

    <div 
      v-if="showReward" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white p-8 rounded-lg text-center transform animate-bounce">
        <h2 class="text-2xl font-bold mb-4">🎉 Goed gedaan! 🎉</h2>
        <p class="mb-2">Sinterklaas heeft het pakje gevonden!</p>
        <p class="text-sm text-gray-600">Je wordt zo doorgestuurd naar de volgende uitdaging...</p>
      </div>
    </div>
  </div>
</template>
