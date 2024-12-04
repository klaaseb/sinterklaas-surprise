import { defineStore } from 'pinia'

interface GameState {
  completedPuzzles: string[];
  currentProgress: number;
}

export const useGameStore = defineStore('game', {
  state: (): GameState => ({
    completedPuzzles: [],
    currentProgress: 0
  }),

  getters: {
    isPuzzleCompleted: (state) => (puzzleId: string) => {
      return state.completedPuzzles.includes(puzzleId)
    },
    
    totalProgress: (state) => {
      return (state.completedPuzzles.length / 6) * 100
    }
  },

  actions: {
    completePuzzle(puzzleId: string) {
      if (!this.completedPuzzles.includes(puzzleId)) {
        this.completedPuzzles.push(puzzleId)
      }
    }
  },

  persist: true
})