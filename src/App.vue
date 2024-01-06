<template>
  <LoginWindow :user="user" v-if="!user.username" />
  <ChatWindow :user="user" v-else />
</template>

<script setup>
import LoginWindow from "./components/LoginWindow.vue";
import ChatWindow from "./components/ChatWindow.vue";
import "./assets/styles/main.css";
import { reactive, provide } from "vue";

const user = reactive({
  id: null,
  username: "",
  status: "",
});

provide("user", user);
</script>

<style></style>
