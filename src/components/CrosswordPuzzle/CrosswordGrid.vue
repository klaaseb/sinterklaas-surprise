<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface CrosswordCell {
  letter: string;
  number?: number;
  isActive: boolean;
  x: number;
  y: number;
}

// Voorbeeld puzzel (pas dit aan naar jouw gewenste woorden)
const puzzle = [
  ['S', 'I', 'N', 'T', '*'],
  ['*', '*', 'O', '*', '*'],
  ['P', 'I', 'E', 'T', '*'],
  ['*', '*', 'T', '*', '*'],
  ['*', '*', '*', '*', '*'],
]

const numbers = {
  '0-0': 1, // SINT
  '0-2': 2, // NOET
  '2-0': 3, // PIET
}

const grid = ref<CrosswordCell[][]>(
  puzzle.map((row, y) => 
    row.map((letter, x) => ({
      letter: letter === '*' ? '' : letter,
      number: numbers[`${y}-${x}`],
      isActive: letter !== '*',
      x,
      y,
    }))
  )
)

const userInput = ref<string[][]>(
  puzzle.map(row => 
    row.map(() => '')
  )
)

const selectedCell = ref<{x: number, y: number} | null>(null)

const hints = [
  { number: 1, hint: "Hij komt elk jaar uit Spanje" },
  { number: 2, hint: "Zonder deze helper geen cadeautjes" },
  { number: 3, hint: "Zwarte ..." },
]

const handleCellClick = (x: number, y: number) => {
  if (grid.value[y][x].isActive) {
    selectedCell.value = { x, y }
  }
}

const handleKeyPress = (event: KeyboardEvent) => {
  if (!selectedCell.value) return
  
  const { x, y } = selectedCell.value
  if (/^[A-Za-z]$/.test(event.key)) {
    userInput.value[y][x] = event.key.toUpperCase()
    // Ga naar volgende cel
    moveToNextCell()
  }
}

const moveToNextCell = () => {
  if (!selectedCell.value) return
  
  let { x, y } = selectedCell.value
  x++
  if (x >= grid.value[0].length) {
    x = 0
    y++
  }
  if (y >= grid.value.length) {
    y = 0
  }
  
  // Zoek de volgende actieve cel
  while (!grid.value[y][x].isActive) {
    x++
    if (x >= grid.value[0].length) {
      x = 0
      y++
    }
    if (y >= grid.value.length) {
      y = 0
    }
  }
  
  selectedCell.value = { x, y }
}

const isCorrect = computed(() => {
  return grid.value.every((row, y) => 
    row.every((cell, x) => 
      !cell.isActive || (userInput.value[y][x] === cell.letter)
    )
  )
})

const emit = defineEmits(['puzzle-completed'])

// Update de watch op isCorrect
watch(isCorrect, (newValue) => {
  if (newValue) {
    emit('puzzle-completed')
  }
})
</script>

<template>
  <div 
    class="flex flex-col items-center gap-8"
    @keydown="handleKeyPress"
    tabindex="0"
  >
    <div class="grid grid-cols-5 gap-1">
      <div 
        v-for="(cell, index) in grid.flat()"
        :key="index"
        :class="[
          'w-12 h-12 border flex items-center justify-center relative',
          cell.isActive ? 'bg-white' : 'bg-gray-200',
          selectedCell?.x === cell.x && selectedCell?.y === cell.y ? 'border-2 border-blue-500' : 'border-gray-300'
        ]"
        @click="handleCellClick(cell.x, cell.y)"
      >
        <span 
          v-if="cell.number" 
          class="absolute text-xs top-0 left-0 p-0.5"
        >
          {{ cell.number }}
        </span>
        <span class="text-xl font-bold">
          {{ userInput[cell.y][cell.x] }}
        </span>
      </div>
    </div>

    <div class="w-full max-w-md">
      <h3 class="font-bold mb-2">Hints:</h3>
      <ul class="list-disc pl-5">
        <li 
          v-for="hint in hints" 
          :key="hint.number"
          class="mb-2"
        >
          {{ hint.number }}. {{ hint.hint }}
        </li>
      </ul>
    </div>

    <div v-if="isCorrect" class="text-green-600 font-bold">
      Gefeliciteerd! Je hebt de puzzel opgelost!
    </div>
  </div>
</template>