<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['puzzle-completed'])

// 0 = pad, 1 = muur, 2 = start (Sint), 3 = eind (pakje)
const mazeTemplate = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
  [1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
]

interface Position {
  x: number
  y: number
}

const maze = ref(structuredClone(mazeTemplate))
const playerPos = ref<Position>({ x: 0, y: 1 }) // Start positie
const showSuccess = ref(false)

const movePlayer = (dx: number, dy: number) => {
  const newX = playerPos.value.x + dx
  const newY = playerPos.value.y + dy

  // Check of nieuwe positie binnen het doolhof valt
  if (newX < 0 || newX >= maze.value[0].length || newY < 0 || newY >= maze.value.length) {
    return
  }

  // Check of nieuwe positie een muur is
  if (maze.value[newY][newX] === 1) {
    return
  }

  // Verplaats speler
  playerPos.value = { x: newX, y: newY }

  // Check of speler het doel heeft bereikt
  if (maze.value[newY][newX] === 3) {
    showSuccess.value = true
    emit('puzzle-completed')
  }
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (showSuccess.value) return

  switch (e.key) {
    case 'ArrowUp':
      movePlayer(0, -1)
      break
    case 'ArrowDown':
      movePlayer(0, 1)
      break
    case 'ArrowLeft':
      movePlayer(-1, 0)
      break
    case 'ArrowRight':
      movePlayer(1, 0)
      break
  }
}

// Touch/swipe handling
const touchStart = ref<Position | null>(null)

const handleTouchStart = (e: TouchEvent) => {
  const touch = e.touches[0]
  touchStart.value = { x: touch.clientX, y: touch.clientY }
}

const handleTouchEnd = (e: TouchEvent) => {
  if (!touchStart.value) return

  const touch = e.changedTouches[0]
  const dx = touch.clientX - touchStart.value.x
  const dy = touch.clientY - touchStart.value.y

  // Bepaal richting van swipe
  if (Math.abs(dx) > Math.abs(dy)) {
    // Horizontale beweging
    if (dx > 50) movePlayer(1, 0)  // Rechts
    else if (dx < -50) movePlayer(-1, 0)  // Links
  } else {
    // Verticale beweging
    if (dy > 50) movePlayer(0, 1)  // Omlaag
    else if (dy < -50) movePlayer(0, -1)  // Omhoog
  }

  touchStart.value = null
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div class="flex items-start gap-8">
    <div class="flex flex-col items-center gap-4">
      <div class="text-center mb-4">
        <p>Help Sinterklaas het pakje te vinden!</p>
        <p class="text-sm text-gray-600">Gebruik de pijltjestoetsen of de knoppen om te bewegen</p>
      </div>

      <div class="grid gap-1 p-4 bg-gray-100 rounded-lg">
        <div 
          v-for="(row, y) in maze" 
          :key="`row-${y}`"
          class="flex gap-1"
        >
          <div
            v-for="(cell, x) in row"
            :key="`cell-${x}-${y}`"
            class="w-8 h-8 flex items-center justify-center rounded"
            :class="{
              'bg-red-800': cell === 1,
              'bg-white': cell === 0 || cell === 2 || cell === 3,
            }"
          >
            <template v-if="x === playerPos.x && y === playerPos.y">
              <span class="text-xl">🎅</span>
            </template>
            <template v-else-if="cell === 3">
              <span class="text-xl">🎁</span>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Extra grote controls met voldoende ruimte -->
    <div class="w-48 flex flex-col items-center gap-4 self-center">
      <button 
        class="w-16 h-16 bg-gray-200 rounded hover:bg-gray-300 flex items-center justify-center text-2xl"
        @click="movePlayer(0, -1)"
      >
        ⬆️
      </button>
      
      <div class="flex gap-4">
        <button 
          class="w-16 h-16 bg-gray-200 rounded hover:bg-gray-300 flex items-center justify-center text-2xl"
          @click="movePlayer(-1, 0)"
        >
          ⬅️
        </button>
        <button 
          class="w-16 h-16 bg-gray-200 rounded hover:bg-gray-300 flex items-center justify-center text-2xl"
          @click="movePlayer(1, 0)"
        >
          ➡️
        </button>
      </div>
      
      <button 
        class="w-16 h-16 bg-gray-200 rounded hover:bg-gray-300 flex items-center justify-center text-2xl"
        @click="movePlayer(0, 1)"
      >
        ⬇️
      </button>
    </div>
  </div>
</template>
