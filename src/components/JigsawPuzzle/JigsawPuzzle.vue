<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import puzzleImage from '../../assets/images/foto-mams.jpg'

const emit = defineEmits(['puzzle-completed'])

interface PuzzlePiece {
  id: number
  x: number
  y: number
  targetX: number
  targetY: number
  width: number
  height: number
  isCorrect: boolean
}

const PUZZLE_SIZE = 3 // 3x3 puzzel
const TOLERANCE = 30 // iets grotere tolerantie voor snappen
const CANVAS_SIZE = 600 // 2x zo groot (was 300)

const canvasRef = ref<HTMLCanvasElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)
const pieces = ref<PuzzlePiece[]>([])
const selectedPiece = ref<PuzzlePiece | null>(null)
const isDragging = ref(false)
const startX = ref(0)
const startY = ref(0)
const imageLoaded = ref(false)
const completed = ref(false)

const image = new Image()
image.src = puzzleImage

const isComplete = computed(() => {
  return pieces.value.every(piece => piece.isCorrect)
})

const checkCompletion = () => {
  console.log('Checking completion...')
  const allCorrect = pieces.value.every(piece => {
    const isInPosition = piece.isCorrect
    console.log(`Piece ${piece.id}: ${isInPosition ? 'correct' : 'incorrect'}`)
    return isInPosition
  })

  console.log('All correct:', allCorrect)
  
  if (allCorrect && !completed.value) {
    console.log('Puzzle completed!')
    completed.value = true
    setTimeout(() => {
      emit('puzzle-completed')
    }, 800)
  }
}

const snapPiece = (piece: PuzzlePiece) => {
  const dx = Math.abs(piece.x - piece.targetX)
  const dy = Math.abs(piece.y - piece.targetY)

  if (dx < TOLERANCE && dy < TOLERANCE) {
    // Direct op exacte positie zetten
    piece.x = piece.targetX
    piece.y = piece.targetY
    piece.isCorrect = true
    
    console.log(`Piece ${piece.id} snapped to position`)
    
    // Direct completion checken na snap
    checkCompletion()
    return true
  }
  return false
}

const initPuzzle = () => {
  if (!canvasRef.value || !ctx.value) return

  const canvas = canvasRef.value
  const pieceWidth = canvas.width / PUZZLE_SIZE
  const pieceHeight = canvas.height / PUZZLE_SIZE

  pieces.value = []
  for (let i = 0; i < PUZZLE_SIZE * PUZZLE_SIZE; i++) {
    const row = Math.floor(i / PUZZLE_SIZE)
    const col = i % PUZZLE_SIZE
    
    // Zorg dat stukjes niet te dicht bij hun eindpositie beginnen
    let x, y
    do {
      x = Math.random() * (canvas.width - pieceWidth)
      y = Math.random() * (canvas.height - pieceHeight)
    } while (
      Math.abs(x - col * pieceWidth) < TOLERANCE * 2 &&
      Math.abs(y - row * pieceHeight) < TOLERANCE * 2
    )
    
    pieces.value.push({
      id: i,
      x,
      y,
      targetX: col * pieceWidth,
      targetY: row * pieceHeight,
      width: pieceWidth,
      height: pieceHeight,
      isCorrect: false
    })
  }
}

const draw = () => {
  if (!canvasRef.value || !ctx.value || !imageLoaded.value) return

  const canvas = canvasRef.value
  ctx.value.clearRect(0, 0, canvas.width, canvas.height)

  // Teken doorzichtige doelposities
  pieces.value.forEach(piece => {
    ctx.value!.strokeStyle = piece.isCorrect ? '#4CAF50' : '#ddd'
    ctx.value!.strokeRect(piece.targetX, piece.targetY, piece.width, piece.height)
  })

  // Teken puzzelstukjes
  pieces.value.forEach(piece => {
    ctx.value!.save()
    ctx.value!.beginPath()
    ctx.value!.rect(piece.x, piece.y, piece.width, piece.height)
    ctx.value!.clip()
    
    const sourceX = (piece.targetX / canvas.width) * image.width
    const sourceY = (piece.targetY / canvas.height) * image.height
    const sourceWidth = (piece.width / canvas.width) * image.width
    const sourceHeight = (piece.height / canvas.height) * image.height
    
    ctx.value!.drawImage(
      image,
      sourceX, sourceY, sourceWidth, sourceHeight,
      piece.x, piece.y, piece.width, piece.height
    )
    
    ctx.value!.restore()
    
    // Teken rand om stukje
    ctx.value!.strokeStyle = piece.isCorrect ? '#4CAF50' : '#000'
    ctx.value!.strokeRect(piece.x, piece.y, piece.width, piece.height)
  })

  requestAnimationFrame(draw)
}

const handleStart = (e: MouseEvent | TouchEvent) => {
  const pos = getEventPosition(e)
  startX.value = pos.x
  startY.value = pos.y

  // Vind het aangeklikte stukje
  selectedPiece.value = pieces.value.findLast(piece => 
    pos.x >= piece.x && 
    pos.x <= piece.x + piece.width && 
    pos.y >= piece.y && 
    pos.y <= piece.y + piece.height
  ) || null

  if (selectedPiece.value) {
    isDragging.value = true
    // Breng geselecteerd stukje naar voorgrond door het laatste te maken in de array
    pieces.value = pieces.value.filter(p => p.id !== selectedPiece.value!.id)
    pieces.value.push(selectedPiece.value)
  }
}

const handleMove = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value || !selectedPiece.value) return

  const pos = getEventPosition(e)
  const dx = pos.x - startX.value
  const dy = pos.y - startY.value

  selectedPiece.value.x += dx
  selectedPiece.value.y += dy
  
  // Reset isCorrect tijdens beweging
  selectedPiece.value.isCorrect = false
  
  startX.value = pos.x
  startY.value = pos.y
}

const handleEnd = () => {
  if (!selectedPiece.value) return

  // Probeer het stukje te snappen
  const didSnap = snapPiece(selectedPiece.value)
  console.log(`Piece ${selectedPiece.value.id} snap result:`, didSnap)

  isDragging.value = false
  selectedPiece.value = null
}

const getEventPosition = (e: MouseEvent | TouchEvent) => {
  if (!canvasRef.value) return { x: 0, y: 0 }

  const rect = canvasRef.value.getBoundingClientRect()
  const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX
  const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY
  
  return {
    x: clientX - rect.left,
    y: clientY - rect.top
  }
}

onMounted(() => {
  if (!canvasRef.value) return
  
  ctx.value = canvasRef.value.getContext('2d')
  if (!ctx.value) return

  // Stel canvas grootte in op nieuwe formaat
  canvasRef.value.width = CANVAS_SIZE
  canvasRef.value.height = CANVAS_SIZE

  image.onload = () => {
    imageLoaded.value = true
    initPuzzle()
    draw()
  }
})
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div class="text-center mb-4">
      <h2 class="text-xl font-bold">Maak de Puzzel!</h2>
      <p class="text-gray-600">Sleep de stukjes naar de juiste plek</p>
    </div>

    <div class="overflow-auto max-w-full">
      <canvas
        ref="canvasRef"
        class="border-2 border-gray-300 rounded-lg touch-none bg-white shadow-lg"
        @mousedown="handleStart"
        @mousemove="handleMove"
        @mouseup="handleEnd"
        @mouseleave="handleEnd"
        @touchstart.prevent="handleStart"
        @touchmove.prevent="handleMove"
        @touchend.prevent="handleEnd"
      ></canvas>
    </div>
  </div>
</template>

<style scoped>
canvas {
  touch-action: none;
}

.overflow-auto {
  -webkit-overflow-scrolling: touch;
}
</style> 