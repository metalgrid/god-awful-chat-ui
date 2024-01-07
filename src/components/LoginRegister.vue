<template>
  <!-- component -->
  <main class="relative min-h-screen w-full bg-white">
    <div class="p-6" x-data="app">
      <!-- header -->
      <header class="flex w-full justify-between">
        <svg
          class="h-7 w-7 cursor-pointer text-gray-400 hover:text-gray-300"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          stroke="currentColor"
        >
          <path
            stroke-width="1"
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          ></path>
        </svg>

        <!-- buttons -->
        <div>
          <button
            type="button"
            @click="isLoginPage = false"
            v-show="isLoginPage"
            class="rounded-2xl border-b-2 border-b-gray-300 bg-white px-4 py-3 font-bold text-blue-500 ring-2 ring-gray-300 hover:bg-gray-200 active:translate-y-[0.125rem] active:border-b-gray-200"
          >
            LOGIN
          </button>

          <button
            type="button"
            @click="isLoginPage = true"
            v-show="!isLoginPage"
            class="rounded-2xl border-b-2 border-b-gray-300 bg-white px-4 py-3 font-bold text-blue-500 ring-2 ring-gray-300 hover:bg-gray-200 active:translate-y-[0.125rem] active:border-b-gray-200"
          >
            SIGN UP
          </button>
        </div>
      </header>

      <div
        class="absolute left-1/2 top-1/2 mx-auto max-w-sm -translate-x-1/2 -translate-y-1/2 transform space-y-4 text-center"
      >
        <!-- register content -->
        <div v-show="isLoginPage" class="space-y-4">
          <header class="mb-3 text-2xl font-bold">Create your account</header>
          <div
            class="w-full rounded-2xl bg-gray-50 px-4 ring-2 ring-gray-200 focus-within:ring-blue-400"
          >
            <input
              type="text"
              v-model="account.username"
              @keyup="validate"
              placeholder="Username"
              class="my-3 w-full border-none bg-transparent outline-none focus:outline-none"
            />
          </div>
          <div
            class="w-full rounded-2xl bg-gray-50 px-4 ring-2 ring-gray-200 focus-within:ring-blue-400"
          >
            <input
              type="password"
              v-model="account.password"
              @keyup="validate"
              placeholder="Password"
              class="my-3 w-full border-none bg-transparent outline-none focus:outline-none"
            />
          </div>
          <div
            class="w-full rounded-2xl bg-gray-50 px-4 ring-2 ring-gray-200 focus-within:ring-blue-400"
          >
            <input
              type="password"
              v-model="pwconfirm"
              @keyup="validate"
              placeholder="Password (confirmation)"
              class="my-3 w-full border-none bg-transparent outline-none focus:outline-none"
            />
          </div>
          <p v-show="errorRegister" class="text-sm text-red-700 italic">
            {{ errorRegister }}
          </p>
          <button
            @click="doRegister"
            :disabled="!valid"
            class="w-full rounded-2xl border-b-4 enabled:border-b-blue-600 bg-blue-500 py-3 font-bold text-white hover:bg-blue-400 active:translate-y-[0.125rem] active:border-b-blue-400 disabled:bg-gray-400"
          >
            CREATE ACCOUNT
          </button>
        </div>

        <!-- login content -->
        <div v-show="!isLoginPage" class="space-y-4">
          <header class="mb-3 text-2xl font-bold">Log in</header>
          <div
            class="w-full rounded-2xl bg-gray-50 px-4 ring-2 ring-gray-200 focus-within:ring-blue-400"
          >
            <input
              type="text"
              placeholder="Username"
              v-model="login.username"
              class="my-3 w-full border-none bg-transparent outline-none focus:outline-none"
            />
          </div>
          <div
            class="flex w-full items-center space-x-2 rounded-2xl bg-gray-50 px-4 ring-2 ring-gray-200 focus-within:ring-blue-400"
          >
            <input
              type="password"
              v-model="login.password"
              placeholder="Password"
              class="my-3 w-full border-none bg-transparent outline-none"
            />
            <a href="#" class="font-medium text-gray-400 hover:text-gray-500">FORGOT?</a>
          </div>
          <p v-show="errorLogin" class="text-sm text-red-700 italic">{{ errorLogin }}</p>
          <button
            @click="doLogin"
            class="w-full rounded-2xl border-b-4 border-b-blue-600 bg-blue-500 py-3 font-bold text-white hover:bg-blue-400 active:translate-y-[0.125rem] active:border-b-blue-400"
          >
            LOG IN
          </button>
        </div>
      </div>
    </div>
  </main>
</template>
<script setup>
import { ref, inject } from "vue";

const auth = inject("auth");

window.auth2 = auth;

let isLoginPage = ref(false);
let errorLogin = ref("");
let errorRegister = ref("");

let pwconfirm = "";
let valid = ref(false);

const login = {
  username: "",
  password: "",
};

const account = {
  username: "",
  password: "",
};

const validate = () => {
  let accountOk = account.username.length > 2;
  let pwOk = account.password.length > 5;
  let pwConfirmOk = account.password === pwconfirm;

  valid.value = accountOk && pwOk && pwConfirmOk;
};

const doLogin = async () => {
  const res = await fetch("http://192.168.100.69:8080/api/v1/auth", {
    mode: "cors",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(login),
  });

  try {
    const data = await res.json();
    window.data = data;
    switch (res.status) {
      case 200:
        errorLogin.value = "";
        auth.token = data.token;
        auth.authorities = data.authorities;
        auth.user = data.user;
        break;
      case 401:
        errorLogin.value = "Auth failed: Invalid username/password!";
        break;
      default:
        errorLogin.value = "Auth failed: Unknown error!";
        break;
    }
  } catch (err) {
    errorLogin.value = `Internal error: ${err.message}`;
  }
};

const doRegister = async () => {
  const res = await fetch("http://192.168.100.69:8080/api/v1/users", {
    mode: "cors",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(account),
  });

  try {
    const data = await res.json();
    switch (res.status) {
      case 200:
        errorRegister.value = "";
        break;
      case 400:
        errorRegister.value = `Registration failed: ${data.message}`;
        break;
      default:
        errorRegister.value = `Registration failed: ${data?.message || "Unknown error"}`;
        break;
    }
  } catch (err) {
    errorRegister.value = `Internal error: ${err.message}`;
  }
};
</script>
