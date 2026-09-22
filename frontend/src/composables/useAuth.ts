import { computed, ref } from 'vue'
import {
  ApiError,
  getCurrentUser,
  login,
  register,
  logout,
  type LoginPayload,
  type RegisterPayload,
  type UserPrivate,
} from '@/services/api'
import router from '@/router'

const user = ref<UserPrivate>()
const authLoading = ref(true)

async function loadCurrentUser() {
  try {
    user.value = await getCurrentUser()
  } catch {
    user.value = undefined
  } finally {
    authLoading.value = false
  }
}

const registerValidation = computed(
  () =>
    register_email.value.length > 0 &&
    register_password.value.length > 0 &&
    register_username.value.length > 0,
)
const loginValidation = computed(
  () => login_email.value.length > 0 && login_password.value.length > 0,
)

const register_username = ref('')
const register_email = ref('')
const register_password = ref('')

const login_email = ref('')
const login_password = ref('')

const error_message = ref('')

async function tryLogin() {
  const payload: LoginPayload = {
    email: login_email.value,
    password: login_password.value,
  } as LoginPayload
  try {
    await login(payload)
    await loadCurrentUser()
    await router.push({ path: '/' })
  } catch (error) {
    if (error instanceof ApiError) {
      error_message.value = `${error.message}`
    }
  }
}

async function tryRegister() {
  const payload: RegisterPayload = {
    username: register_username.value,
    email: register_email.value,
    password: register_password.value,
  } as RegisterPayload
  try {
    await register(payload)
    await loadCurrentUser()
    await router.push({ path: '/' })
  } catch (error) {
    if (error instanceof ApiError) {
      error_message.value = `${error.message}`
    }
  }
}

async function tryLogout() {
  try {
    await logout()
  } catch (error) {
    if (error instanceof ApiError) {
      error_message.value = `${error.message}`
    }
  }
}

export function useAuth() {
  return {
    user,
    authLoading,
    loadCurrentUser,
    tryRegister,
    tryLogin,
    tryLogout,
    register_email,
    register_username,
    register_password,
    login_email,
    login_password,
    registerValidation,
    loginValidation,
    error_message,
  }
}
