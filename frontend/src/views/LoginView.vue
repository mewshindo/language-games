<script setup lang="ts">
import { ref } from 'vue';

const register_username = ref('')
const register_email = ref('')
const register_password = ref('')

const login_email = ref('')
const login_password = ref('')
</script>

<template>
    <div class="container">
        <div class="register">
            <h1>Register</h1>
                <input type="text" placeholder="username" name="username" v-model="register_username">
                <input type="text" placeholder="email" name="email" v-model="register_email">
                <input type="text" placeholder="password" name="password" v-model="register_password">
                <button>register</button>

                <a>{{ register_username }}</a>
        </div>
        <div style="flex-grow: .3;">
            <h2 class="or">or</h2>
        </div>
        <div class="login">
            <h1>Login</h1>
                <input type="text" placeholder="email" name="email" v-model="login_email">
                <input type="text" placeholder="password" name="password" v-model="login_password">
                <button>login</button>
        </div>
    </div>
</template>

<style scoped>
.container{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 100vh;
}
.or{
    height: 100%;
    text-align: center;
}
.register,
.login{
    display: flex;
    max-width: 400px;
    gap: 10px;
    flex-direction: column;
    text-align: center;
}
@media (max-width: 700px) {
    .container{
        flex-direction: column;
        margin: auto;
    }
    .register,
    .login{
        max-width: 60vw;
    }
    .or{
        display: none;
    }
}
</style>