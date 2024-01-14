<template>
  <div class="element flex flex-row items-center justify-center">
    <form @keyup.enter="loginForm ? login : register">
      <div v-if="!loginForm" class="w-full relative">
        <span class="absolute left-3 top-1/2 transform -translate-y-1/2"
          ><fa-icon class="text-gray-400" :icon="['fas', 'id-card']"></fa-icon
        ></span>
        <input type="text" placeholder="Full Name" v-model="fullName" />
      </div>
      <div class="w-full relative">
        <span class="absolute left-3 top-1/2 transform -translate-y-1/2"
          ><fa-icon class="text-gray-400" :icon="['fas', 'user']"></fa-icon
        ></span>
        <input type="text" placeholder="Username" v-model="credentials.username" />
      </div>
      <div class="w-full relative">
        <span class="absolute left-3 top-1/2 transform -translate-y-1/2"
          ><fa-icon class="text-gray-400" :icon="['fas', 'key']"></fa-icon
        ></span>
        <input type="password" placeholder="Password" v-model="credentials.password" />
      </div>
      <div v-if="!loginForm" class="w-full relative">
        <span class="absolute left-3 top-1/2 transform -translate-y-1/2"
          ><fa-icon class="text-gray-400" :icon="['fas', 'key']"></fa-icon
        ></span>
        <input type="password" placeholder="Confirm Password" v-model="confirmPassword" />
      </div>

      <div
        v-if="error"
        class="mb-3 inline-flex w-full items-center rounded-lg bg-red-100 px-6 py-5 text-base text-red-700"
        role="alert"
      >
        <span class="mr-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="h-5 w-5"
          >
            <path
              fill-rule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
        {{ error }}
      </div>

      <button v-if="loginForm" @click="login" class="btn w-full" type="button">
        <span class="w-1/2">Login</span>
        <fa-icon :icon="['fas', 'right-to-bracket']"></fa-icon>
      </button>
      <button
        v-if="!loginForm"
        @click="register"
        :disabled="credentials.password.length < 5 || credentials.password != confirmPassword"
        class="btn w-full"
        type="button"
      >
        Register
      </button>
      <p v-if="loginForm" class="text-center">
        Don't have an account? <a @click="loginForm = false">Register</a>
      </p>
      <p v-if="!loginForm" class="text-center">
        Already have an account? <a @click="loginForm = true">Login</a>
      </p>
    </form>
  </div>
</template>
<script setup lang="ts">
import { setCookie } from '@/composables/cookies'
import type { Auth, LoginRequest } from '@/types'
import { ref, inject, type Ref } from 'vue'
import { useRouter } from 'vue-router'

const auth: Ref<Auth> = inject('auth', {} as Ref<Auth>)
const error = ref('')
const loginForm = ref(true)
const fullName = ref('')

const router = useRouter()

const credentials: Ref<LoginRequest> = ref({
  username: '',
  password: ''
})

const confirmPassword = ref('')

const login = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials.value)
    })

    switch (response.status) {
      case 200:
        auth.value = await response.json()
        setCookie('auth', auth.value, 1)
        router.push({ name: 'home' })
        break
      case 401:
        error.value = 'Invalid username/password'
        break
      default:
        error.value = 'Something went wrong'
        break
    }
  } catch (e: any) {
    error.value = e.message
  }
}

const register = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...credentials.value, fullName: fullName.value })
    })

    switch (response.status) {
      case 200:
        await login()
        break
      case 400:
        error.value = 'Account exists!'
        break
      default:
        error.value = 'Something went wrong'
        break
    }
  } catch (e: any) {
    error.value = e.message
  }
}
</script>
<style scoped>
.element {
  @apply bg-white bg-opacity-80 rounded-lg shadow-lg p-6;
}

input {
  @apply bg-gray-600 bg-opacity-10 placeholder-gray-500 text-gray-400 text-sm py-1 px-10 rounded-md outline-none w-full focus:outline-none focus:ring;
  @apply text-slate-500;
}

button {
  @apply my-2 p-2 flex flex-row justify-center items-center text-white bg-blue-500 rounded-lg cursor-pointer;
  /* @apply flex flex-col justify-center items-center border-gray-100 border p-2 rounded-lg bg-gray-50 bg-opacity-30 focus:outline-none focus:ring; */
  @apply hover:bg-blue-700 hover:border-blue-400;
  @apply font-bold text-sm;
}

button:disabled {
  @apply bg-gray-200 bg-opacity-80 border-gray-100 border text-gray-400;
  @apply cursor-not-allowed;
}

a {
  @apply text-blue-700;
  @apply cursor-pointer;
}

a:hover {
  @apply text-indigo-700;
}
</style>
