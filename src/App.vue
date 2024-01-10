<template>
  <LoginRegister v-if="!auth?.user" />
  <ChatWindow v-else :user="auth.user" />
</template>

<script setup>
import LoginRegister from "./components/LoginRegister.vue";
import ChatWindow from "./components/ChatWindow.vue";
import "./assets/styles/main.css";
import { reactive, provide } from "vue";

const auth = reactive({});

provide("auth", auth);
</script>

<style></style>
