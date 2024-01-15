<template>
  <div>Logged in as: {{ auth?.user.username }}</div>
  <div v-for="user in users" :key="user.id">
    <h2>{{ user.username }}</h2>
  </div>
</template>
<script setup lang="ts">
import type { Auth, User } from "@/types";
import { inject, unref, type Ref } from "vue";
import { useAPI } from "@/composables/api";
import { useCall } from "@/composables/call";

// Router ensures auth is defined
const auth = unref(inject<Ref<Auth>>("auth"))!;
const users = inject<Ref<User[]>>("users");

const initCallAPI = async () => {
    const {stompClient} = await useAPI(import.meta.env.VITE_API_URL, auth.user.username, auth.token);
    
    const callAPI = useCall(auth.user, stompClient)
}
// API will initialize our global stompClient

initCallAPI();

</script>
