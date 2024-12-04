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
        to="/maze"
        class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
      >
        Sinterklaas Doolhof
      </router-link>
      
      <router-link 
        to="/catch"
        class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
      >
        Pepernoten Vangen
      </router-link>
      
      <router-link 
        to="/candy"
        class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
      >
        Snoep Puzzel
      </router-link>
      
      <router-link 
        to="/memory"
        class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
      >
        Pakjes Memory
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