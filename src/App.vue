<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-md p-4">
      <div class="container mx-auto">
        <router-link to="/" class="mr-4">Home</router-link>
        <router-link to="/crossword" class="mr-4">Kruiswoord</router-link>
        <router-link to="/sliding" class="mr-4">Schuifpuzzel</router-link>
        <router-link to="/quiz">Quiz</router-link>
      </div>
    </nav>
    
    <main class="container mx-auto p-4">
      <router-view></router-view>
    </main>
  </div>
</template>