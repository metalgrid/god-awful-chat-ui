<template>
  <div
    class="primary transition-all duration-500 ease-in-out flex flex-row items-center justify-center"
  >
    <form @keyup.enter="login">
      <input class="w-full" type="text" placeholder="Username" v-model="credentials.username" />
      <input class="w-full" type="password" placeholder="Password" v-model="credentials.password" />
      <input
        v-if="!loginForm"
        class="w-full"
        type="password"
        placeholder="Confirm Password"
        v-model="confirmPassword"
      />

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

      <button v-if="loginForm" @click="login" class="btn w-full" type="button">Login</button>
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
import type { Auth } from '@/types'
import { ref, inject, type Ref } from 'vue'
import { useRouter } from 'vue-router'

const auth: Ref<Auth> = inject('auth', {} as Ref<Auth>)
const error = ref('')
const loginForm = ref(true)

const router = useRouter()

const credentials = ref({
  username: '',
  password: ''
})
const confirmPassword = ref('')

const login = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/v1/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials.value)
    })

    switch (response.status) {
      case 200:
        auth.value = await response.json()
        router.push({ name: 'chat' })
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
    const response = await fetch('http://localhost:8080/api/v1/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials.value)
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
