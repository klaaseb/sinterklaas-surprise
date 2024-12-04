<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const emit = defineEmits(['puzzle-completed'])

const CANDIES = ['🍪', '📜', '🍫', '🎁', '🌟', '🎠', '⭐']
const GRID_SIZE = 8
const POINTS_NEEDED = 500
const MATCH_MIN = 3

interface GridItem {
  id: number;
  type: string;
  isSelected: boolean;
  isMatching: boolean;
  isNew: boolean;
  isFalling: boolean;
  isClearing: boolean;
  isSwapping: boolean;
  swapDirection: string;
}

const score = ref(0)
const grid = ref<GridItem[][]>([])
const selectedCell = ref<{ row: number; col: number } | null>(null)
const isProcessing = ref(false) // Voorkom meerdere acties tegelijk
let nextId = 0

// Voeg drag state toe
const dragStart = ref<{ row: number; col: number; x: number; y: number } | null>(null)
const isDragging = ref(false)
const dragThreshold = 20 // Minimale pixels om een drag te detecteren

const initializeGrid = () => {
  grid.value = Array(GRID_SIZE).fill(null).map(() =>
    Array(GRID_SIZE).fill(null).map(() => ({
      id: nextId++,
      type: CANDIES[Math.floor(Math.random() * CANDIES.length)],
      isSelected: false,
      isMatching: false,
      isNew: false,
      isFalling: false,
      isClearing: false,
      isSwapping: false,
      swapDirection: ''
    }))
  )
  
  // Check initiële matches
  requestAnimationFrame(() => {
    while (findMatches().length > 0) {
      const matches = findMatches()
      matches.forEach(({ row, col }) => {
        grid.value[row][col].type = CANDIES[Math.floor(Math.random() * CANDIES.length)]
      })
    }
  })
}

const findMatches = () => {
  const matches: { row: number; col: number }[] = []

  // Horizontale matches
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE - (MATCH_MIN - 1); col++) {
      const type = grid.value[row][col].type
      let matchLength = 1
      
      while (col + matchLength < GRID_SIZE && 
             grid.value[row][col + matchLength].type === type) {
        matchLength++
      }

      if (matchLength >= MATCH_MIN) {
        for (let i = 0; i < matchLength; i++) {
          matches.push({ row, col: col + i })
        }
      }
    }
  }

  // Verticale matches
  for (let col = 0; col < GRID_SIZE; col++) {
    for (let row = 0; row < GRID_SIZE - (MATCH_MIN - 1); row++) {
      const type = grid.value[row][col].type
      let matchLength = 1

      while (row + matchLength < GRID_SIZE && 
             grid.value[row + matchLength][col].type === type) {
        matchLength++
      }

      if (matchLength >= MATCH_MIN) {
        for (let i = 0; i < matchLength; i++) {
          matches.push({ row: row + i, col })
        }
      }
    }
  }

  return matches
}

const removeMatches = async () => {
  const matches = findMatches()
  if (matches.length === 0) return false

  matches.forEach(({ row, col }) => {
    grid.value[row][col].isClearing = true
  })

  await new Promise(resolve => setTimeout(resolve, 500))

  matches.forEach(({ row, col }) => {
    grid.value[row][col].type = ''
    grid.value[row][col].isClearing = false
  })
  
  score.value += matches.length * 10
  return true
}

const fillEmptySpaces = async () => {
  // Markeer vallende items
  for (let col = 0; col < GRID_SIZE; col++) {
    let emptyRow = GRID_SIZE - 1
    for (let row = GRID_SIZE - 1; row >= 0; row--) {
      if (grid.value[row][col].type !== '') {
        if (emptyRow !== row) {
          grid.value[row][col].isFalling = true
        }
        emptyRow--
      }
    }
  }

  await new Promise(resolve => setTimeout(resolve, 200))

  // Verplaats items
  for (let col = 0; col < GRID_SIZE; col++) {
    let emptyRow = GRID_SIZE - 1
    for (let row = GRID_SIZE - 1; row >= 0; row--) {
      if (grid.value[row][col].type !== '') {
        if (emptyRow !== row) {
          grid.value[emptyRow][col].type = grid.value[row][col].type
          grid.value[row][col].type = ''
        }
        emptyRow--
      }
    }
  }

  // Reset states en vul nieuwe items
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      grid.value[row][col].isFalling = false
      if (grid.value[row][col].type === '') {
        grid.value[row][col].isNew = true
        grid.value[row][col].type = CANDIES[Math.floor(Math.random() * CANDIES.length)]
      }
    }
  }

  await new Promise(resolve => setTimeout(resolve, 500))

  // Reset new state
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      grid.value[row][col].isNew = false
    }
  }
}

// Touch/mouse handlers
const handleDragStart = (row: number, col: number, event: MouseEvent | TouchEvent) => {
  if (isProcessing.value) return
  
  const pos = event instanceof MouseEvent ? event : event.touches[0]
  dragStart.value = {
    row,
    col,
    x: pos.clientX,
    y: pos.clientY
  }
  
  grid.value[row][col].isSelected = true
}

const handleDragMove = async (event: MouseEvent | TouchEvent) => {
  if (!dragStart.value || isProcessing.value) return
  
  const pos = event instanceof MouseEvent ? event : event.touches[0]
  const deltaX = pos.clientX - dragStart.value.x
  const deltaY = pos.clientY - dragStart.value.y
  
  // Check of we de threshold hebben bereikt
  if (!isDragging.value && Math.max(Math.abs(deltaX), Math.abs(deltaY)) > dragThreshold) {
    isDragging.value = true
    
    // Bepaal richting
    const direction = Math.abs(deltaX) > Math.abs(deltaY)
      ? (deltaX > 0 ? 'right' : 'left')
      : (deltaY > 0 ? 'down' : 'up')
      
    // Bereken nieuwe positie
    let newRow = dragStart.value.row
    let newCol = dragStart.value.col
    
    switch (direction) {
      case 'left': newCol--; break
      case 'right': newCol++; break
      case 'up': newRow--; break
      case 'down': newRow++; break
    }
    
    // Check of nieuwe positie geldig is
    if (newRow >= 0 && newRow < GRID_SIZE && 
        newCol >= 0 && newCol < GRID_SIZE) {
      // Voer swap uit
      await handleCellSwap(dragStart.value.row, dragStart.value.col, newRow, newCol)
    }
    
    // Reset drag state
    resetDragState()
  }
}

const handleDragEnd = () => {
  resetDragState()
}

const resetDragState = () => {
  if (dragStart.value) {
    grid.value[dragStart.value.row][dragStart.value.col].isSelected = false
  }
  dragStart.value = null
  isDragging.value = false
}

// Update bestaande handleCellClick om nieuwe swap functie te gebruiken
const handleCellClick = async (row: number, col: number) => {
  if (isProcessing.value) return
  
  if (selectedCell.value === null) {
    selectedCell.value = { row, col }
    grid.value[row][col].isSelected = true
  } else {
    const { row: prevRow, col: prevCol } = selectedCell.value
    
    if ((Math.abs(row - prevRow) === 1 && col === prevCol) ||
        (Math.abs(col - prevCol) === 1 && row === prevRow)) {
      await handleCellSwap(prevRow, prevCol, row, col)
    }

    // Reset selectie
    grid.value[prevRow][prevCol].isSelected = false
    selectedCell.value = null
  }
}

// Nieuwe functie voor het swappen van cellen
const handleCellSwap = async (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
  if (isProcessing.value) return
  isProcessing.value = true

  const currentCell = grid.value[toRow][toCol]
  const previousCell = grid.value[fromRow][fromCol]
  
  // Bepaal swap richting
  if (toRow < fromRow) {
    currentCell.swapDirection = 'down'
    previousCell.swapDirection = 'up'
  } else if (toRow > fromRow) {
    currentCell.swapDirection = 'up'
    previousCell.swapDirection = 'down'
  } else if (toCol < fromCol) {
    currentCell.swapDirection = 'right'
    previousCell.swapDirection = 'left'
  } else {
    currentCell.swapDirection = 'left'
    previousCell.swapDirection = 'right'
  }

  // Start swap animatie
  currentCell.isSwapping = true
  previousCell.isSwapping = true

  await new Promise(resolve => setTimeout(resolve, 300))

  // Swap items
  const temp = currentCell.type
  currentCell.type = previousCell.type
  previousCell.type = temp

  // Reset swap states
  currentCell.isSwapping = false
  previousCell.isSwapping = false
  currentCell.swapDirection = ''
  previousCell.swapDirection = ''

  // Check matches
  if (await removeMatches()) {
    await fillEmptySpaces()
    while (findMatches().length > 0) {
      await removeMatches()
      await fillEmptySpaces()
    }
  } else {
    // Animeer swap terug
    currentCell.isSwapping = true
    previousCell.isSwapping = true
    
    const tempDirection = currentCell.swapDirection
    currentCell.swapDirection = previousCell.swapDirection
    previousCell.swapDirection = tempDirection

    await new Promise(resolve => setTimeout(resolve, 300))

    // Swap terug
    const temp = currentCell.type
    currentCell.type = previousCell.type
    previousCell.type = temp

    // Reset swap states
    currentCell.isSwapping = false
    previousCell.isSwapping = false
    currentCell.swapDirection = ''
    previousCell.swapDirection = ''
  }

  isProcessing.value = false
}

watch(score, (newScore) => {
  if (newScore >= POINTS_NEEDED) {
    emit('puzzle-completed')
  }
})

onMounted(() => {
  initializeGrid()
})
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div 
      class="text-2xl font-bold"
      :class="{ 'animate-bounce-slow': score > 0 && score % 100 === 0 }"
    >
      Score: {{ score }}/{{ POINTS_NEEDED }}
    </div>

    <div 
      class="grid gap-1 p-4 bg-red-100 rounded-lg touch-none"
      @mouseleave="handleDragEnd"
    >
      <div 
        v-for="(row, rowIndex) in grid" 
        :key="rowIndex"
        class="flex gap-1"
      >
        <div
          v-for="(cell, colIndex) in row"
          :key="cell.id"
          class="w-11 h-11 flex items-center justify-center bg-white rounded-lg cursor-pointer transition-all duration-500"
          :class="{
            'ring-2 ring-blue-500 scale-110': cell.isSelected,
            'hover:bg-blue-50': !cell.isSelected && !isDragging,
            'animate-bounce-slow scale-125': cell.isMatching,
            'animate-fade-out-slow scale-0': cell.isClearing,
            'animate-fall-slow': cell.isFalling,
            'animate-pop-in-slow': cell.isNew,
            'animate-swap-left': cell.isSwapping && cell.swapDirection === 'left',
            'animate-swap-right': cell.isSwapping && cell.swapDirection === 'right',
            'animate-swap-up': cell.isSwapping && cell.swapDirection === 'up',
            'animate-swap-down': cell.isSwapping && cell.swapDirection === 'down'
          }"
          @mousedown="handleDragStart(rowIndex, colIndex, $event)"
          @touchstart="handleDragStart(rowIndex, colIndex, $event)"
          @mousemove="handleDragMove($event)"
          @touchmove="handleDragMove($event)"
          @mouseup="handleDragEnd"
          @touchend="handleDragEnd"
          @click="handleCellClick(rowIndex, colIndex)"
        >
          <span 
            class="transition-transform duration-500 select-none"
            :class="{
              'rotate-180': cell.isClearing,
              'scale-110': cell.isSelected
            }"
          >
            {{ cell.type }}
          </span>
        </div>
      </div>
    </div>

    <p class="text-sm text-gray-600">
      Maak rijen van {{ MATCH_MIN }} of meer dezelfde items!
    </p>
  </div>
</template>

<style scoped>
@keyframes fade-out {
  to {
    opacity: 0;
    transform: scale(0) rotate(180deg);
  }
}

@keyframes fall {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes pop-in {
  0% {
    transform: scale(0) translateY(-20px);
    opacity: 0;
  }
  70% {
    transform: scale(1.2) translateY(0);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-25%);
  }
}

.animate-fade-out-slow {
  animation: fade-out 0.8s ease-out;
}

.animate-fall-slow {
  animation: fall 0.8s ease-in-out;
}

.animate-pop-in-slow {
  animation: pop-in 0.8s ease-out;
}

.animate-bounce-slow {
  animation: bounce-slow 1s ease-in-out infinite;
}

@keyframes swap-left {
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes swap-right {
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes swap-up {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes swap-down {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
