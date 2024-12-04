<script setup lang="ts">
import { onMounted, ref } from 'vue'
import confetti from 'canvas-confetti'

const showMessage = ref(false)

onMounted(() => {
  // Start confetti
  const duration = 3 * 1000
  const end = Date.now() + duration

  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']

  ;(function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors
    })
    
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors
    })

    if (Date.now() < end) {
      requestAnimationFrame(frame)
    } else {
      // Toon bericht na confetti
      setTimeout(() => {
        showMessage.value = true
      }, 500)
    }
  }())
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-sinterklaas-cream">
    <div 
      v-if="showMessage"
      class="text-center p-8 bg-white rounded-lg shadow-xl transform animate-fade-in"
    >
      <h1 class="text-3xl font-bold mb-6 text-red-600">
        🎉 Gefeliciteerd! 🎉
      </h1>
      <p class="text-xl mb-4">
        Je hebt alle spelletjes voltooid!
      </p>
      <p class="text-2xl font-bold text-green-600 mt-8">
        Het cadeautje ligt onder het bed van Klaas en Jo
      </p>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 1s ease-out forwards;
}
</style> 