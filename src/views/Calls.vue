<template>
  <div class="flex flex-col space-y-2 items-center">
    <div class="text-center font-bold text-2xl text-white p-2 bg-blue-400 rounded">
      Logged in as: {{ auth?.user.username }}
    </div>
    <div
      class="w-full"
      @click="
        () => {
          callee = user
          callAPI.call(user.username)
        }
      "
      v-for="user in users"
      :key="user.id"
    >
      <p class="p-2 bg-gray-300 rounded">
        <fa-icon :icon="['fas', 'user']" class="mr-2 text-indigo-700"></fa-icon>{{ user.username }}
      </p>
    </div>
    <div v-if="incomingCall" class="p-2 text-center">
      <p>Call from {{ incomingCall.caller.fullName || incomingCall.caller.username }}</p>
      <div class="flex flex-row space-x-2">
        <button class="p-2 bg-green-400 text-white rounded" @click="accept">Answer</button>
        <button class="p-2 bg-red-400 text-white rounded">Decline</button>
      </div>
    </div>
    <div class="w-full flex flex-row space-x-2">
      <div class="relative">
        <p
          class="absolute bottom-0 w-full text-center text-2xl font-bold drop-shadow text-white rounded-b-xl bg-slate-500"
        >
          {{ auth.user.fullName }}
        </p>
        <video
          class="h-96 bg-gray-300 rounded-xl border-2 border-blue-500"
          ref="localVideo"
          id="local-video"
          autoplay
          muted
        ></video>
      </div>
      <div class="relative">
        <p
          class="absolute bottom-0 w-full text-center text-2xl font-bold drop-shadow text-white rounded-b-xl bg-slate-500"
        >
          {{ callee?.fullName || incomingCall?.caller.fullName || 'Waiting for call...' }}
        </p>
        <video
          class="h-96 bg-gray-300 rounded-xl border-2 border-blue-500"
          ref="remoteVideo"
          id="remote-video"
          autoplay
        ></video>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Auth, User } from '@/types'
import { inject, unref, type Ref, ref } from 'vue'
import { useAPI } from '@/composables/api'
import { useCall, CallEvent } from '@/composables/call'
import type { Invite, CallAPI } from '@/composables/call'
// Router ensures auth is defined
const auth = unref(inject<Ref<Auth>>('auth'))!
const users = ref<User[]>()
const callee = ref<User | null>(null)

const localVideo: Ref<HTMLVideoElement | null> = ref(null)
const remoteVideo: Ref<HTMLVideoElement | null> = ref(null)

const incomingCall: Ref<Invite | null> = ref(null)

let callAPI: CallAPI

const accept = async () => {
  if (incomingCall.value === null) throw new Error('No incoming call')
  const invite = incomingCall.value

  await callAPI.accept(invite)
}

const initCallAPI = async () => {
  const { api, stompClient } = await useAPI(
    import.meta.env.VITE_API_URL,
    auth.user.username,
    auth.token
  )

  users.value = await api.getUsers()

  callAPI = await useCall(auth.user, stompClient)
  callAPI.on(CallEvent.INCOMING_CALL, (invite: Invite) => {
    incomingCall.value = invite
  })

  window.callAPI = callAPI
}
// API will initialize our global stompClient

initCallAPI()
</script>
