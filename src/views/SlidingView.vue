<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/game'
import SlidingGrid from '../components/SlidingPuzzle/SlidingGrid.vue'

const router = useRouter()
const gameStore = useGameStore()
const showReward = ref(false)

const imageUrl = 'https://fastly.picsum.photos/id/621/536/354.jpg?hmac=_8_0dSqKvqAOmC-OYdQNAd-gcWiXFDI9svR-kItggsg'

const handlePuzzleComplete = () => {
  gameStore.completePuzzle('sliding')
  showReward.value = true
  
  setTimeout(() => {
    router.push('/')
  }, 3000)
}
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-6 text-center">
      Schuifpuzzel
    </h1>
    
    <SlidingGrid 
      :image-url="imageUrl"
      :grid-size="3"
      @puzzle-completed="handlePuzzleComplete"
    />

    <div 
      v-if="showReward" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white p-8 rounded-lg text-center transform animate-bounce">
        <h2 class="text-2xl font-bold mb-4">🎉 Goed gedaan! 🎉</h2>
        <p class="mb-2">Je hebt de schuifpuzzel opgelost!</p>
        <p class="text-sm text-gray-600">Je wordt zo doorgestuurd naar het overzicht...</p>
      </div>
    </div>
  </div>
</template>