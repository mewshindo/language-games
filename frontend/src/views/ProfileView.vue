<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { useStats } from '@/composables/useStats'
import router from '@/router'
import waitUntil from 'async-wait-until'
import { onMounted } from 'vue'

const { user, authLoading } = useAuth()

const { username, created, total_runs, completed_runs, getStats } = useStats(user)

onMounted(async () => {
  await waitUntil(() => authLoading.value == false)
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
