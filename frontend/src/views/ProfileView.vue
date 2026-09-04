<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { useStats } from '@/composables/useStats'
import router from '@/router'
import { onMounted } from 'vue'

const { user } = useAuth()

const { username, created, total_runs, completed_runs, getStats } = useStats(user)

onMounted(async () => {
  if (!user.value) {
    router.push('/login')
  }
  await getStats()
})
</script>

<template>
  <div>
    <h1>{{ username }}</h1>
    <h2>Joined: {{ created }}</h2>
    <h2>Total runs: {{ total_runs }}</h2>
    <h2>Completed runs: {{ completed_runs }}</h2>
  </div>
</template>
