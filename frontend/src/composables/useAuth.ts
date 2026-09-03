import { computed, ref, type Ref } from 'vue'
import { ApiError, getCurrentUser, login, type LoginPayload, type RegisterPayload, type Token, type UserPrivate } from '@/services/api'
import router from '@/router'

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
  if (localStorage.getItem('access_token')) {
    localStorage.removeItem('access_token')
  }
  const payload: LoginPayload = {
    email: login_email.value,
    password: login_password.value,
  } as LoginPayload
  let tokenTry: Token
  try {
    tokenTry = await login(payload)
    localStorage.setItem('access_token', tokenTry.access_token)
    await loadCurrentUser()
    await router.push({ path: '/' })
  } catch (error) {
    if (error instanceof ApiError) {
      error_message.value = `${error.message}`
    }
  }
}

async function tryRegister(){
    if (localStorage.getItem('access_token')) {
    localStorage.removeItem('access_token')
  }
  const payload: RegisterPayload = {
    username: register_username.value,
    email: register_email.value,
    password: register_password.value,
  } as RegisterPayload
  let tokenTry: Token
  try {
    tokenTry = await login(payload)
    localStorage.setItem('access_token', tokenTry.access_token)
    await loadCurrentUser()
    await router.push({ path: '/' })
  } catch (error) {
    if (error instanceof ApiError) {
      error_message.value = `${error.message}`
    }
  }
}

export function useAuth() {
  return { user, loadCurrentUser,
    tryLogin,
    tryRegister,
    register_email,
    register_username,
    register_password,
    login_email,
    login_password,
    registerValidation,
    loginValidation,
    error_message
   }
}
