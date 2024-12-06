import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', {
  state: () => ({
    completedPuzzles: JSON.parse(localStorage.getItem('completedPuzzles') || '[]') as string[]
  }),

  actions: {
    completePuzzle(puzzleId: string) {
      if (!this.completedPuzzles.includes(puzzleId)) {
        this.completedPuzzles.push(puzzleId)
        localStorage.setItem('completedPuzzles', JSON.stringify(this.completedPuzzles))
      }
    },

    isPuzzleCompleted(puzzleId: string) {
      return this.completedPuzzles.includes(puzzleId)
    },

    resetProgress() {
      console.log('Resetting progress...');
      this.completedPuzzles = []
      localStorage.removeItem('completedPuzzles')
    }
  }
})