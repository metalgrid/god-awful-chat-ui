<template>
  <div class="flex flex-col items-center">
    <div class="w-full text-center">Logged in as: {{ auth?.user.username }}</div>
    <div
      class="w-full"
      @click="callAPI.call(user.username)"
      v-for="user in users"
      :key="user.id"
    >
      <p class="p-2 bg-gray-300 rounded">
        <fa-icon :icon="['fas', 'user']" class="mr-2 text-indigo-700"></fa-icon
        >{{ user.username }}
      </p>
    </div>
    <div v-if="incomingCall" class="p-2 text-center">
      <p>Call from {{ incomingCall.caller.fullName || incomingCall.caller.username }}</p>
      <div class="flex flex-row space-x-2">
        <button class="p-2 bg-green-400 text-white rounded">Answer</button>
        <button class="p-2 bg-red-400 text-white rounded">Decline</button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Auth, User } from "@/types";
import { inject, unref, type Ref, ref } from "vue";
import { useAPI } from "@/composables/api";
import { useCall, CallEvent } from "@/composables/call";
import type {
  Invite,
  CallAPI
} from "@/composables/call";
// Router ensures auth is defined
const auth = unref(inject<Ref<Auth>>("auth"))!;
const users = ref<User[]>();

const incomingCall: Ref<Invite | null> = ref(null);

let callAPI: CallAPI;

const accept = async () => {
  const {offer} = incomingCall.value!;
  const pc = new RTCPeerConnection({iceServers: [{urls: "stun:stun.l.google.com:19302"}]});
  await pc.setRemoteDescription(offer);
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
}

const initCallAPI = async () => {
    const {api, stompClient} = await useAPI(import.meta.env.VITE_API_URL, auth.user.username, auth.token);

    users.value = await api.getUsers();

    callAPI = await useCall(auth.user, stompClient)
    callAPI.on(CallEvent.INCOMING_CALL, (invite: Invite) => {
      incomingCall.value = invite;
    })

    window.callAPI = callAPI;
}
// API will initialize our global stompClient

initCallAPI();
</script>
