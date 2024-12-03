<script setup lang="ts">
import { useGameStore } from '../stores/game'

const gameStore = useGameStore()
</script>

<template>
  <div class="text-center">
    <h1 class="text-3xl font-bold mb-4">Welkom bij de Sinterklaas Surprise!</h1>
    <p class="mb-4">
      Lieve Anneke, los deze puzzels op om je cadeau te vinden!
    </p>
    
    <div class="grid gap-4 max-w-xl mx-auto">
      <router-link 
        to="/crossword"
        class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
      >
        Kruiswoordpuzzel
      </router-link>
      
      <router-link 
        to="/sliding"
        class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
      >
        Schuifpuzzel
      </router-link>
      
      <router-link 
        to="/quiz"
        class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
      >
        Foto Quiz
      </router-link>
    </div>
  </div>
</template>
