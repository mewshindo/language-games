import { getUserStats, type UserPrivate } from '@/services/api'
import { ref, type Ref } from 'vue'

export function useStats(user: Ref<UserPrivate | undefined>) {
  const username = ref<string>()
  const created = ref<string>()
  const total_runs = ref<string>()
  const completed_runs = ref<string>()

  async function getStats() {
    if (!user.value) {
      console.error('user is undefined')
      return
    }
    try {
      const stats = await getUserStats(user.value.id.toString())
      username.value = stats.username
      const date = new Date(stats.created)
      created.value = date.toDateString().substring(4)
      total_runs.value = stats.total_runs.toString()
      completed_runs.value = stats.completed_runs.toString()
    } catch (error) {
      console.error(error)
    }
  }

  return {
    username,
    created,
    total_runs,
    completed_runs,
    getStats,
  }
}
