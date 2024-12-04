<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface MemoryCard {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const emit = defineEmits(['puzzle-completed'])

// Sinterklaas-themed emoji's
const cardValues = ['🎁', '🍬', '🍪', '🎠', '📜', '🦌', '⭐', '🌟']
const cards = ref<MemoryCard[]>([])
const flippedCards = ref<MemoryCard[]>([])
const moves = ref(0)

// Creëer en shuffle de kaarten
const initializeGame = () => {
  const values = [...cardValues, ...cardValues]
  cards.value = values
    .sort(() => Math.random() - 0.5)
    .map((value, index) => ({
      id: index,
      value,
      isFlipped: false,
      isMatched: false
    }))
  moves.value = 0
  flippedCards.value = []
}

const handleCardClick = (card: MemoryCard) => {
  // Voorkom klikken als kaart al omgedraaid is of als er al 2 kaarten open zijn
  if (card.isFlipped || card.isMatched || flippedCards.value.length >= 2) return

  // Draai kaart om
  card.isFlipped = true
  flippedCards.value.push(card)

  // Check voor match als er 2 kaarten zijn omgedraaid
  if (flippedCards.value.length === 2) {
    moves.value++
    
    if (flippedCards.value[0].value === flippedCards.value[1].value) {
      // Match gevonden
      flippedCards.value.forEach(card => card.isMatched = true)
      flippedCards.value = []
      
      // Check voor win
      if (cards.value.every(card => card.isMatched)) {
        emit('puzzle-completed')
      }
    } else {
      // Geen match, draai kaarten terug om
      setTimeout(() => {
        flippedCards.value.forEach(card => card.isFlipped = false)
        flippedCards.value = []
      }, 1000)
    }
  }
}

// Start het spel bij mount
onMounted(() => {
  initializeGame()
})
</script>

<template>
  <div class="flex flex-col items-center gap-6 w-[500px] mx-auto">
    <div class="text-xl">
      Zetten: {{ moves }}
    </div>
    
    <div 
      class="grid grid-cols-4 gap-4 w-full"
    >
      <div
        v-for="card in cards"
        :key="card.id"
        class="aspect-square perspective-500"
        @click="handleCardClick(card)"
      >
        <div
          class="relative w-full h-full transition-transform duration-500 transform-style-3d"
          :class="{ 'rotate-y-180': card.isFlipped }"
        >
          <!-- Voorkant (dicht) -->
          <div
            class="absolute w-full h-full bg-red-600 rounded-lg flex items-center justify-center cursor-pointer backface-hidden"
          >
            <div class="text-white text-2xl font-bold">?</div>
          </div>
          
          <!-- Achterkant (open) -->
          <div
            class="absolute w-full h-full bg-white rounded-lg flex items-center justify-center cursor-pointer backface-hidden rotate-y-180"
            :class="{ 'bg-green-100': card.isMatched }"
          >
            <div class="text-4xl">{{ card.value }}</div>
          </div>
        </div>
      </div>
    </div>

    <button
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      @click="initializeGame"
    >
      Opnieuw beginnen
    </button>
  </div>
</template>

<style scoped>
.perspective-500 {
  perspective: 500px;
}

.transform-style-3d {
  transform-style: preserve-3d;
}

.backface-hidden {
  backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}
</style>
