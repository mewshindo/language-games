<script setup lang="ts">
import { computed, ref } from 'vue'
import { ApiError, login, type LoginPayload, type Token } from '@/services/api'

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

const emit = defineEmits<{
  (e: 'error-occured', value: Error): void
}>()

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
  } catch (error) {
    if (error instanceof ApiError) {
      emit('error-occured', error)
      error_message.value = `${error.message}`
    }
  }
}
</script>

<template>
  <div class="container">
    <div class="register">
      <h1>Register</h1>
      <input type="text" placeholder="username" name="username" v-model="register_username" />
      <input type="text" placeholder="email" name="email" v-model="register_email" />
      <input type="text" placeholder="password" name="password" v-model="register_password" />
      <button :class="{ disable: !registerValidation }">sign up</button>
    </div>
    <div style="flex-grow: 0.3">
      <h2 class="or">or</h2>
    </div>
    <div class="login">
      <h1>Login</h1>
      <input type="text" placeholder="email" name="email" v-model="login_email" />
      <input type="text" placeholder="password" name="password" v-model="login_password" />
      <button @click="tryLogin" :class="{ disable: !loginValidation }">sign in</button>
      <a v-show="error_message.length > 0" style="justify-self: end;">Error: {{ error_message }}</a>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.or {
  height: 100%;
  text-align: center;
}
.register,
.login {
  display: flex;
  width: 300px;
  gap: 10px;
  flex-direction: column;
  text-align: center;
}
input,
button {
  height: 40px;
  font-size: 20px;
  padding: 8px;
  background-color: var(--color-background);
  border: 2px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text);
  margin-bottom: 8px;
}
input,
button:focus {
  outline: none;
}
input,
button:hover {
  cursor: pointer;
}
.disable {
  pointer-events: none;
  opacity: 0.8;
  cursor: not-allowed;
}
@media (max-width: 700px) {
  .container {
    flex-direction: column;
    margin: auto;
  }
  .register,
  .login {
    max-width: 60vw;
  }
  .or {
    display: none;
  }
}
</style>
