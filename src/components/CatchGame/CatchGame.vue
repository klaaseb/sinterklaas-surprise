<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['puzzle-completed'])

interface GameObject {
  id: number;
  x: number;
  y: number;
  speed: number;
}

const gameWidth = 400
const gameHeight = 600
const bagWidth = 80
const itemSize = 40

const score = ref(0)
const gameOver = ref(false)
const bagPosition = ref(gameWidth / 2)
const items = ref<GameObject[]>([])
let gameLoop: number
let itemId = 0

// Beweeg de zak
const moveBag = (e: MouseEvent | Touch) => {
  const rect = (e.target as HTMLElement).getBoundingClientRect()
  const x = e.clientX - rect.left
  bagPosition.value = Math.max(bagWidth/2, Math.min(x, gameWidth - bagWidth/2))
}

const handleTouch = (e: TouchEvent) => {
  e.preventDefault()
  moveBag(e.touches[0])
}

// Voeg nieuwe pepernoot toe
const addItem = () => {
  items.value.push({
    id: itemId++,
    x: Math.random() * (gameWidth - itemSize),
    y: -itemSize,
    speed: 2 + Math.random() * 2
  })
}

// Update game state
const updateGame = () => {
  if (gameOver.value) return

  // Beweeg items
  items.value = items.value.filter(item => {
    item.y += item.speed

    // Check voor vangen
    if (item.y + itemSize > gameHeight - 50 && 
        item.y < gameHeight - 40 &&
        item.x + itemSize > bagPosition.value - bagWidth/2 &&
        item.x < bagPosition.value + bagWidth/2) {
      score.value++
      if (score.value >= 20) {
        gameOver.value = true
        emit('puzzle-completed')
      }
      return false
    }

    // Verwijder items die voorbij zijn
    if (item.y > gameHeight) {
      return false
    }

    return true
  })

  // Voeg nieuwe items toe
  if (Math.random() < 0.03) {
    addItem()
  }

  gameLoop = requestAnimationFrame(updateGame)
}

onMounted(() => {
  gameLoop = requestAnimationFrame(updateGame)
})

onUnmounted(() => {
  cancelAnimationFrame(gameLoop)
})
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div class="text-2xl font-bold">
      Score: {{ score }}/20
    </div>

    <div 
      class="relative bg-blue-100 rounded-lg overflow-hidden cursor-none"
      :style="{ width: `${gameWidth}px`, height: `${gameHeight}px` }"
      @mousemove="moveBag"
      @touchmove="handleTouch"
      @touchstart="handleTouch"
    >
      <!-- Vallende pepernoten -->
      <div
        v-for="item in items"
        :key="item.id"
        class="absolute text-3xl"
        :style="{
          left: `${item.x}px`,
          top: `${item.y}px`,
          width: `${itemSize}px`,
          height: `${itemSize}px`,
        }"
      >
        🍪
      </div>

      <!-- Sinterklaas zak -->
      <div
        class="absolute bottom-0 text-5xl"
        :style="{
          left: `${bagPosition - bagWidth/2}px`,
          width: `${bagWidth}px`,
          height: '60px'
        }"
      >
        👜
      </div>
    </div>

    <p class="text-sm text-gray-600">
      Vang 20 pepernoten om door te gaan!
    </p>
  </div>
</template>

<style scoped>
.cursor-none {
  cursor: none;
}
</style>
