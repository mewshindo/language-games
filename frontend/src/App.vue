<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { onMounted, ref } from 'vue';
import { getCurrentUser, type UserPrivate } from './services/api';

const user = ref<UserPrivate>()

onMounted(async () => {
  let token = localStorage.getItem('access_token');
  if(token){
    try{
      let userQuery = await getCurrentUser(token);
      if(userQuery){
        user.value = userQuery;
      }
    }
    catch{;}
  }
})
</script>

<template>
  <div class="app">
    <header>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
      <div style="flex-grow: 0.8;"></div>
      <RouterLink to="/login" v-if="!user">Login</RouterLink>
      <RouterLink to="/profile" v-if="user">{{ user.username }}</RouterLink>
    </header>
    <RouterView />
  </div>
</template>

<style scoped>
header {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  width: 100%;
  gap: 1.5rem;
  padding: 1rem 2rem;
  background-color: var(--color-background);
  border-bottom: 1px solid var(--color-border);
}

.app {
  display: flex;
  position: relative;
  flex-direction: column;
  max-height: 90vh;
  width: 100%;
}
</style>
