<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/game'
import CrosswordGrid from '../components/CrosswordPuzzle/CrosswordGrid.vue'

const router = useRouter()
const gameStore = useGameStore()
const showReward = ref(false)

const handlePuzzleComplete = () => {
  gameStore.completePuzzle('crossword')
  showReward.value = true
  
  // Na 3 seconden doorsturen naar de volgende puzzle
  setTimeout(() => {
    router.push('/sliding')
  }, 3000)
}
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-6 text-center">
      Kruiswoordpuzzel
    </h1>
    
    <CrosswordGrid @puzzle-completed="handlePuzzleComplete" />

    <!-- Belonings overlay -->
    <div 
      v-if="showReward" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white p-8 rounded-lg text-center transform animate-bounce">
        <h2 class="text-2xl font-bold mb-4">🎉 Goed gedaan! 🎉</h2>
        <p class="mb-2">Je hebt de kruiswoordpuzzel opgelost!</p>
        <p class="text-sm text-gray-600">Je wordt zo doorgestuurd naar de volgende uitdaging...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes bounce {
  0%, 100% { transform: translateY(-5%); }
  50% { transform: translateY(0); }
}

.animate-bounce {
  animation: bounce 1s infinite;
}
</style>
