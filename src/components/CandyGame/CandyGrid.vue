<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

const emit = defineEmits(['puzzle-completed'])

// Sinterklaas snoepgoed emoji's
const CANDIES = ['🍪', '📜', '🍫', '🎁', '🌟']
const GRID_SIZE = 8
const MATCH_MIN = 3
const POINTS_NEEDED = 500

interface GridItem {
  id: number;
  type: string;
  isSelected: boolean;
  isMatching: boolean;
}

const score = ref(0)
const grid = ref<GridItem[][]>([])
const selectedCell = ref<{ row: number; col: number } | null>(null)
let nextId = 0

// Initialiseer het grid
const initializeGrid = () => {
  grid.value = Array(GRID_SIZE).fill(null).map(() =>
    Array(GRID_SIZE).fill(null).map(() => ({
      id: nextId++,
      type: CANDIES[Math.floor(Math.random() * CANDIES.length)],
      isSelected: false,
      isMatching: false
    }))
  )
  
  // Controleer en verwijder initiële matches
  while (findMatches().length > 0) {
    removeMatches()
    fillEmptySpaces()
  }
}

// Vind alle matches in het grid
const findMatches = () => {
  const matches: { row: number; col: number }[] = []

  // Check horizontale matches
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE - 2; col++) {
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

  // Check verticale matches
  for (let col = 0; col < GRID_SIZE; col++) {
    for (let row = 0; row < GRID_SIZE - 2; row++) {
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

// Verwijder matches en update score
const removeMatches = () => {
  const matches = findMatches()
  if (matches.length === 0) return false

  matches.forEach(({ row, col }) => {
    grid.value[row][col].type = ''
  })

  score.value += matches.length * 10
  return true
}

// Vul lege plekken op
const fillEmptySpaces = () => {
  // Laat items naar beneden vallen
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

  // Vul lege plekken met nieuwe items
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid.value[row][col].type === '') {
        grid.value[row][col].type = CANDIES[Math.floor(Math.random() * CANDIES.length)]
      }
    }
  }
}

// Handle cell click
const handleCellClick = (row: number, col: number) => {
  if (selectedCell.value === null) {
    selectedCell.value = { row, col }
    grid.value[row][col].isSelected = true
  } else {
    const { row: prevRow, col: prevCol } = selectedCell.value
    
    // Check if adjacent
    if ((Math.abs(row - prevRow) === 1 && col === prevCol) ||
        (Math.abs(col - prevCol) === 1 && row === prevRow)) {
      // Swap items
      const temp = grid.value[row][col].type
      grid.value[row][col].type = grid.value[prevRow][prevCol].type
      grid.value[prevRow][prevCol].type = temp

      // Check for matches
      if (!removeMatches()) {
        // Swap back if no matches
        const temp = grid.value[row][col].type
        grid.value[row][col].type = grid.value[prevRow][prevCol].type
        grid.value[prevRow][prevCol].type = temp
      } else {
        // Continue with cascade effect
        setTimeout(() => {
          fillEmptySpaces()
          checkForNewMatches()
        }, 300)
      }
    }

    // Reset selection
    grid.value[prevRow][prevCol].isSelected = false
    selectedCell.value = null
  }
}

// Check for new matches after cascade
const checkForNewMatches = () => {
  if (removeMatches()) {
    setTimeout(() => {
      fillEmptySpaces()
      checkForNewMatches()
    }, 300)
  }
}

// Watch score for win condition
watch(score, (newScore) => {
  if (newScore >= POINTS_NEEDED) {
    emit('puzzle-completed')
  }
})

// Initialize on mount
onMounted(() => {
  initializeGrid()
})
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div class="text-2xl font-bold">
      Score: {{ score }}/{{ POINTS_NEEDED }}
    </div>

    <div class="grid gap-1 p-4 bg-red-100 rounded-lg">
      <div 
        v-for="(row, rowIndex) in grid" 
        :key="rowIndex"
        class="flex gap-1"
      >
        <div
          v-for="(cell, colIndex) in row"
          :key="cell.id"
          class="w-12 h-12 flex items-center justify-center bg-white rounded-lg cursor-pointer text-2xl transition-all duration-200"
          :class="{
            'ring-2 ring-blue-500 scale-110': cell.isSelected,
            'hover:bg-blue-50': !cell.isSelected
          }"
          @click="handleCellClick(rowIndex, colIndex)"
        >
          {{ cell.type }}
        </div>
      </div>
    </div>

    <p class="text-sm text-gray-600">
      Maak rijen van 3 of meer dezelfde items!
    </p>
  </div>
</template>
