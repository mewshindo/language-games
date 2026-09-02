import { ref } from 'vue'
import { getCurrentUser, type UserPrivate } from '@/services/api'

const user = ref<UserPrivate>()

async function loadCurrentUser() {
  const token = localStorage.getItem('access_token')

  if (!token) {
    user.value = undefined
    return
  }
  try {
    user.value = await getCurrentUser(token)
  } catch {
    user.value = undefined
    localStorage.removeItem('access_token')
  }
}

export function useAuth() {
  return { user, loadCurrentUser }
}
