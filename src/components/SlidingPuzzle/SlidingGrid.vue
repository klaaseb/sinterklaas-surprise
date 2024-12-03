<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const props = defineProps<{
  imageUrl: string;
  gridSize?: number;
}>()

const emit = defineEmits(['puzzle-completed'])

const gridSize = props.gridSize || 3
const tiles = ref<number[]>([])
const isLoading = ref(true)

// Houdt de positie bij van het lege vakje
const emptyIndex = ref(gridSize * gridSize - 1)

// Genereer initiële staat
const initializePuzzle = () => {
  tiles.value = Array.from({ length: gridSize * gridSize - 1 }, (_, i) => i + 1)
  tiles.value.push(0) // 0 representeert het lege vakje
  shuffleTiles()
}

// Shuffle de tiles
const shuffleTiles = () => {
  for (let i = tiles.value.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles.value[i], tiles.value[j]] = [tiles.value[j], tiles.value[i]]
    if (tiles.value[i] === 0) emptyIndex.value = i
    if (tiles.value[j] === 0) emptyIndex.value = j
  }
}

// Check of een tile verplaatst kan worden
const canMoveTile = (index: number) => {
  const row = Math.floor(index / gridSize)
  const emptyRow = Math.floor(emptyIndex.value / gridSize)
  const col = index % gridSize
  const emptyCol = emptyIndex.value % gridSize

  return (
    (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
    (Math.abs(col - emptyCol) === 1 && row === emptyRow)
  )
}

// Verplaats een tile
const moveTile = (index: number) => {
  if (!canMoveTile(index)) return

  [tiles.value[index], tiles.value[emptyIndex.value]] = 
  [tiles.value[emptyIndex.value], tiles.value[index]]
  
  emptyIndex.value = index

  if (isPuzzleSolved.value) {
    emit('puzzle-completed')
  }
}

// Check of puzzle is opgelost
const isPuzzleSolved = computed(() => {
  return tiles.value.every((tile, index) => {
    if (index === tiles.value.length - 1) return tile === 0
    return tile === index + 1
  })
})

// Bereken de positie van elke tile voor de background-position
const getTileStyle = (tileNumber: number) => {
  if (tileNumber === 0) return { opacity: 0 }
  
  const index = tileNumber - 1
  const row = Math.floor(index / gridSize)
  const col = index % gridSize
  const percentX = (col / (gridSize - 1)) * 100
  const percentY = (row / (gridSize - 1)) * 100

  return {
    backgroundImage: `url(${props.imageUrl})`,
    backgroundSize: `${gridSize * 100}%`,
    backgroundPosition: `${percentX}% ${percentY}%`,
  }
}

onMounted(() => {
  // Laad de afbeelding eerst
  const img = new Image()
  img.onload = () => {
    isLoading.value = false
    initializePuzzle()
  }
  img.src = props.imageUrl
})
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div v-if="isLoading" class="text-center">
      Laden...
    </div>
    
    <div 
      v-else
      class="grid gap-1"
      :style="{
        'grid-template-columns': `repeat(${gridSize}, 1fr)`,
        width: '300px',
        height: '300px'
      }"
    >
      <div
        v-for="(tile, index) in tiles"
        :key="index"
        :style="getTileStyle(tile)"
        class="aspect-square cursor-pointer transition-transform duration-200 hover:scale-[0.98]"
        @click="moveTile(index)"
      />
    </div>

    <button
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      @click="initializePuzzle"
    >
      Reset Puzzle
    </button>
  </div>
</template>