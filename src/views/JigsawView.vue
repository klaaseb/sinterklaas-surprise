<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/game'
import JigsawPuzzle from '../components/JigsawPuzzle/JigsawPuzzle.vue'

const router = useRouter()
const gameStore = useGameStore()
const showReward = ref(false)

const handlePuzzleComplete = () => {
  gameStore.completePuzzle('jigsaw')
  showReward.value = true
  
  setTimeout(() => {
    router.push('/')
  }, 3000)
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <JigsawPuzzle @puzzle-completed="handlePuzzleComplete" />

    <div 
      v-if="showReward" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white p-8 rounded-lg text-center">
        <h2 class="text-2xl font-bold mb-4">🎉 Goed gedaan! 🎉</h2>
        <p>Je hebt de puzzel opgelost!</p>
      </div>
    </div>
  </div>
</template> 