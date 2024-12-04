<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <main class="container mx-auto p-4">
      <router-view></router-view>
    </main>
  </div>
</template>