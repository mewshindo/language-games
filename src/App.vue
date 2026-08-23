<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app">
    <header>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </header>
    <RouterView />
  </div>
</template>

<style scoped>
header {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 5vh;
  max-height: 7vh;
  width: 100%;
  gap: 1.5rem;
  padding: 1rem 2rem;
  background-color: var(--color-background);
  border-bottom: 1px solid var(--color-border);
}

.app {
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  width: 100%;
}
</style>
