<template>
  <!-- component -->

  <div class="h-screen p-5">
    <section class="shadow-xl rounded-md w-full lg:w-11/12 lg:mx-auto flex">
      <!-- Left section -->
      <div
        class="w-full lg:w-3/6 xl:w-2/6 flex flex-col justify-start items-stretch bg-white bg-opacity-80 rounded-md lg:rounded-none lg:rounded-l-md p-3"
      >
        <div class="flex-auto flex flex-col">
          <div class="flex-auto flex flex-row">
            <!-- [+] navigation -->
            <div class="p-1 flex flex-col justify-between items-center">
              <div class="">
                <div class="p-1 flex justify-center items-center text-gray-500 cursor-pointer">
                  <button
                    class="flex flex-col justify-center items-center w-full p-1 rounded-lg hover:bg-gray-50 hover:bg-opacity-30 focus:outline-none focus:ring"
                    aria-label="Hamburger menu"
                  >
                    <fa-icon class="h-5 w-5" :icon="['fas', 'bars']" />
                  </button>
                </div>
                <ul class="">
                  <nav-button icon="comments" :badge="allUnreads" active>All chats</nav-button>
                  <nav-button icon="comment-dots">Unread</nav-button>
                  <nav-button icon="address-card">Personal</nav-button>
                  <nav-button icon="sliders">Edit</nav-button>
                </ul>
              </div>
              <ul>
                <nav-button icon="gear" @click="editProfile = true">Settings</nav-button>
              </ul>
            </div>
            <!-- [-] navigation -->
            <!-- [+] user list -->
            <div class="w-full p-1">
              <search-box v-model="search"></search-box>
              <ul class="overflow-y-auto">
                <chat-room
                  @click="
                    () => {
                      openConvo(chat)
                    }
                  "
                  v-for="chat in publicChats"
                  :key="chat.id"
                  :conversation="chat"
                  :active="activeConvo !== null && chat.id === activeConvo.id"
                  :badge="unreads[chat.id]"
                ></chat-room>
                <user-card
                  @click="
                    () => {
                      openChat(user)
                    }
                  "
                  v-for="user in users"
                  :key="user.id"
                  :user="user"
                  :status-text="conversations[user.username]?.messages?.[0]?.message"
                  :active="activeConvo !== null && user.username === activeConvo.username"
                  :badge="unreads[user.username]"
                ></user-card>
              </ul>
            </div>
            <!-- [-] user list -->
          </div>
        </div>
      </div>
      <!-- Middle section -->
      <div
        class="hidden w-3/6 bg-white h-full lg:flex flex-col justify-start items-stretch border-r-2 border-l-2 border-gray-100 lg:rounded-r-md xl:rounded-none"
      >
        <!-- Header with name -->
        <div
          class="flex flex-row items-center justify-between px-3 py-2 bg-gray-50 bg-opacity-40 border-b-2 border-gray-100"
        >
          <div class="">
            <h2 class="font-medium">
              {{ activeConvo?.fullName || activeConvo?.username }}
            </h2>
            <p class="text-xs text-gray-500">{{ activeConvo?.status }}</p>
          </div>
          <div class="flex flex-row">
            <button
              type="button"
              class="p-2 ml-2 text-gray-400 rounded-full hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring"
              aria-label="Search"
            >
              <svg class="w-6 h-6 fill-current" viewBox="0 0 20 20">
                <path
                  d="M12.323,2.398c-0.741-0.312-1.523-0.472-2.319-0.472c-2.394,0-4.544,1.423-5.476,3.625C3.907,7.013,3.896,8.629,4.49,10.102c0.528,1.304,1.494,2.333,2.72,2.99L5.467,17.33c-0.113,0.273,0.018,0.59,0.292,0.703c0.068,0.027,0.137,0.041,0.206,0.041c0.211,0,0.412-0.127,0.498-0.334l1.74-4.23c0.583,0.186,1.18,0.309,1.795,0.309c2.394,0,4.544-1.424,5.478-3.629C16.755,7.173,15.342,3.68,12.323,2.398z M14.488,9.77c-0.769,1.807-2.529,2.975-4.49,2.975c-0.651,0-1.291-0.131-1.897-0.387c-0.002-0.004-0.002-0.004-0.002-0.004c-0.003,0-0.003,0-0.003,0s0,0,0,0c-1.195-0.508-2.121-1.452-2.607-2.656c-0.489-1.205-0.477-2.53,0.03-3.727c0.764-1.805,2.525-2.969,4.487-2.969c0.651,0,1.292,0.129,1.898,0.386C14.374,4.438,15.533,7.3,14.488,9.77z"
                ></path>
              </svg>
            </button>
            <button
              type="button"
              class="p-2 ml-2 text-gray-400 xl:text-blue-500 rounded-full hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring"
              aria-label="Open"
            >
              <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <g>
                  <rect fill="none" height="24" width="24" />
                  <g>
                    <path
                      d="M2,4v16h20V4H2z M20,8.67h-2.5V6H20V8.67z M17.5,10.67H20v2.67h-2.5V10.67z M4,6h11.5v12H4V6z M17.5,18v-2.67H20V18H17.5z"
                    />
                  </g>
                </g>
              </svg>
            </button>
            <button
              type="button"
              class="p-2 ml-2 text-gray-400 rounded-full hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring"
              aria-label="More"
            >
              <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path
                  fill-rule="nonzero"
                  d="M12,16 C13.1045695,16 14,16.8954305 14,18 C14,19.1045695 13.1045695,20 12,20 C10.8954305,20 10,19.1045695 10,18 C10,16.8954305 10.8954305,16 12,16 Z M12,10 C13.1045695,10 14,10.8954305 14,12 C14,13.1045695 13.1045695,14 12,14 C10.8954305,14 10,13.1045695 10,12 C10,10.8954305 10.8954305,10 12,10 Z M12,4 C13.1045695,4 14,4.8954305 14,6 C14,7.1045695 13.1045695,8 12,8 C10.8954305,8 10,7.1045695 10,6 C10,4.8954305 10.8954305,4 12,4 Z"
                />
              </svg>
            </button>
          </div>
        </div>
        <!-- Messages -->
        <div ref="msgbox" class="flex-auto flex flex-col justify-between overflow-y-auto">
          <div class="flex flex-col">
            <message
              v-for="msg in activeConvo?.messages"
              :key="msg.id"
              :local="msg.user.username == auth.user.username"
              :message="msg"
            ></message>
          </div>
        </div>
        <!-- Input for writing a messages -->
        <message-box @message="sendMessage"></message-box>
      </div>
      <!-- Right section -->
      <div class="hidden w-2/6 xl:block bg-white rounded-r-md p-5 overflow-y-auto">
        <header class="flex flex-row justify-end items-center">
          <button
            type="button"
            class="p-2 ml-2 text-gray-400 rounded-full hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring"
          >
            <svg class="fill-current h-6 w-6" viewBox="0 0 20 20">
              <path
                d="M15.898,4.045c-0.271-0.272-0.713-0.272-0.986,0l-4.71,4.711L5.493,4.045c-0.272-0.272-0.714-0.272-0.986,0s-0.272,0.714,0,0.986l4.709,4.711l-4.71,4.711c-0.272,0.271-0.272,0.713,0,0.986c0.136,0.136,0.314,0.203,0.492,0.203c0.179,0,0.357-0.067,0.493-0.203l4.711-4.711l4.71,4.711c0.137,0.136,0.314,0.203,0.494,0.203c0.178,0,0.355-0.067,0.492-0.203c0.273-0.273,0.273-0.715,0-0.986l-4.711-4.711l4.711-4.711C16.172,4.759,16.172,4.317,15.898,4.045z"
              ></path>
            </svg>
          </button>
        </header>
        <main>
          <div class="my-6">
            <ul class="flex flex-row justify-center items-center">
              <li>
                <button
                  type="button"
                  class="flex flex-col justify-center items-center p-2 m-2 w-16 h-16 text-gray-400 rounded-full hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring"
                >
                  <svg class="fill-current h-6 w-6 mb-2" viewBox="0 0 24 24">
                    <path
                      d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 8c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm-6 4c.22-.72 3.31-2 6-2 2.7 0 5.8 1.29 6 2H9zm-3-3v-3h3v-2H6V7H4v3H1v2h3v3z"
                    />
                  </svg>
                  <p class="text-xs font-semibold">Add</p>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  class="flex flex-col justify-center items-center p-2 m-2 w-16 h-16 text-gray-400 rounded-full hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring"
                >
                  <svg class="fill-current h-6 w-6 mb-2" viewBox="0 0 24 24">
                    <path
                      fill-rule="nonzero"
                      d="M11,20 L13,20 C13.5522847,20 14,20.4477153 14,21 C14,21.5128358 13.6139598,21.9355072 13.1166211,21.9932723 L13,22 L11,22 C10.4477153,22 10,21.5522847 10,21 C10,20.4871642 10.3860402,20.0644928 10.8833789,20.0067277 L11,20 L13,20 L11,20 Z M3.30352462,2.28241931 C3.6693482,1.92735525 4.23692991,1.908094 4.62462533,2.21893936 L4.71758069,2.30352462 L21.2175807,19.3035246 C21.6022334,19.6998335 21.5927842,20.332928 21.1964754,20.7175807 C20.8306518,21.0726447 20.2630701,21.091906 19.8753747,20.7810606 L19.7824193,20.6964754 L18.127874,18.9919007 L18,18.9999993 L4,18.9999993 C3.23933773,18.9999993 2.77101468,18.1926118 3.11084891,17.5416503 L3.16794971,17.4452998 L5,14.6972244 L5,8.9999993 C5,7.98873702 5.21529462,7.00715088 5.62359521,6.10821117 L3.28241931,3.69647538 C2.89776658,3.3001665 2.90721575,2.66707204 3.30352462,2.28241931 Z M7.00817933,8.71121787 L7,9 L7,14.6972244 C7,15.0356672 6.91413188,15.3676193 6.75167088,15.6624466 L6.66410059,15.8066248 L5.86851709,17 L16.1953186,17 L7.16961011,7.7028948 C7.08210009,8.02986218 7.02771758,8.36725335 7.00817933,8.71121787 Z M12,2 C15.7854517,2 18.8690987,5.00478338 18.995941,8.75935025 L19,9 L19,12 C19,12.5522847 18.5522847,13 18,13 C17.4871642,13 17.0644928,12.6139598 17.0067277,12.1166211 L17,12 L17,9 C17,6.23857625 14.7614237,4 12,4 C11.3902636,4 10.7970241,4.10872043 10.239851,4.31831953 C9.72293204,4.51277572 9.14624852,4.25136798 8.95179232,3.734449 C8.75733613,3.21753002 9.01874387,2.6408465 9.53566285,2.4463903 C10.3171048,2.15242503 11.1488212,2 12,2 Z"
                    ></path>
                  </svg>
                  <p class="text-xs font-semibold">Mute</p>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  class="flex flex-col justify-center items-center p-2 m-2 w-16 h-16 text-gray-400 rounded-full hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring"
                >
                  <svg class="fill-current h-6 w-6 mb-2" viewBox="0 0 24 24">
                    <g><path d="M0,0h24v24H0V0z" fill="none" /></g>
                    <g>
                      <path
                        d="M17,8l-1.41,1.41L17.17,11H9v2h8.17l-1.58,1.58L17,16l4-4L17,8z M5,5h7V3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h7v-2H5V5z"
                      />
                    </g>
                  </svg>
                  <p class="text-xs font-semibold">Leave</p>
                </button>
              </li>
            </ul>
          </div>
          <div class="my-4">
            <ul>
              <li class="flex flex-row my-3">
                <div class="mr-4">
                  <img
                    src="https://www.kormanmd.com/wp-content/uploads/sites/38/2019/02/botox-men-2-768x720.jpg"
                    class="w-12 h-12 rounded-full"
                    alt=""
                  />
                </div>
                <div class="flex flex-col justify-center">
                  <h2 class="text-sm font-bold">Jose Waldow</h2>
                  <p class="text-xs text-blue-600 font-normal">Online</p>
                </div>
              </li>
              <li class="flex flex-row my-3">
                <div class="mr-4">
                  <img
                    src="https://www.telegraph.co.uk/multimedia/archive/03249/archetypal-male-fa_3249635c.jpg"
                    class="w-12 h-12 rounded-full"
                    alt=""
                  />
                </div>
                <div class="flex flex-col justify-center">
                  <h2 class="text-sm font-bold">Sherwood Rosol</h2>
                  <p class="text-xs text-blue-600 font-normal">Online</p>
                </div>
              </li>
              <li class="flex flex-row my-3">
                <div class="mr-4">
                  <img
                    src="https://images.fastcompany.net/image/upload/w_596,c_limit,q_auto:best,f_auto/wp-cms/uploads/2019/02/5-create-fake-people-in-2-seconds-on-this-insane-site.jpg"
                    class="w-12 h-12 rounded-full"
                    alt=""
                  />
                </div>
                <div class="flex flex-col justify-center">
                  <h2 class="text-sm font-bold">Leena Hannan</h2>
                  <p class="text-xs text-gray-400 font-normal">last seen 40 minutes ago</p>
                </div>
              </li>
              <li class="flex flex-row my-3">
                <div class="mr-4">
                  <img
                    src="https://www.statnews.com/wp-content/uploads/2018/01/AdobeStock_107381486-645x645.jpeg"
                    class="w-12 h-12 rounded-full"
                    alt=""
                  />
                </div>
                <div class="flex flex-col justify-center">
                  <h2 class="text-sm font-bold">Yaeko Lindblom</h2>
                  <p class="text-xs text-gray-400 font-normal">last seen 40 minutes ago</p>
                </div>
              </li>
            </ul>
          </div>
          <div class="">
            <ul class="flex flex-row justify-between items-center bg-gray-50 rounded-lg p-1">
              <li class="bg-white px-3 py-1 text-xs font-semibold rounded-md cursor-pointer">
                Media
              </li>
              <li class="text-xs text-gray-500 font-semibold px-3 py-1 cursor-pointer">Links</li>
              <li class="text-xs text-gray-500 font-semibold px-3 py-1 cursor-pointer">Files</li>
              <li class="text-xs text-gray-500 font-semibold px-3 py-1 cursor-pointer">Voice</li>
            </ul>
            <ul class="grid grid-cols-3 gap-2 my-3">
              <li class="">
                <img
                  class="rounded-md"
                  src="https://hips.hearstapps.com/ghk.h-cdn.co/assets/16/38/1474395998-ghk-0216-comfortfoodcover-meatballs.jpg?crop=0.856xw:0.571xh;0.0224xw,0.296xh&resize=640:*"
                  alt=""
                />
              </li>
              <li class="">
                <img
                  class="rounded-md"
                  src="https://media.self.com/photos/5f189b76c58e27c99fbef9e3/1:1/w_768,c_limit/blackberry-vanilla-french-toast.jpg"
                  alt=""
                />
              </li>
              <li class="">
                <img
                  class="rounded-md"
                  src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/gettyimages-1036880806.jpg?crop=0.6666666666666666xw:1xh;center,top&resize=640:*"
                  alt=""
                />
              </li>
              <li class="">
                <img
                  class="rounded-md"
                  src="https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=700%2C636"
                  alt=""
                />
              </li>
            </ul>
          </div>
        </main>
      </div>
    </section>
  </div>
  <profile
    v-if="editProfile"
    @close="editProfile = false"
    @update:user="updateUser"
    @update:avatar="updateUserImage"
    :user="auth.user"
  ></profile>
</template>
<script setup lang="ts">
import NavButton from '@/components/sidenav/NavButton.vue'
import SearchBox from '@/components/contacts/SearchBox.vue'
import ChatRoom from '@/components/contacts/ChatRoom.vue'
import UserCard from '@/components/contacts/UserCard.vue'
import Message from '@/components/messages/Message.vue'
import MessageBox from '@/components/messages/MessageBox.vue'
import Profile from '@/components/profile/Profile.vue'
import { useAPI } from '@/composables/api'

import { inject, ref, unref, provide, computed, onMounted, nextTick } from 'vue'
import type { Auth, Conversation, MessageRequest, User } from '@/types'
import type { IMessage } from '@stomp/stompjs'
const search = ref('')
const users = ref<User[]>([])
const publicChats = ref<Conversation[]>([])
const editProfile = ref(false)

const msgbox = ref<HTMLDivElement | null>(null)

const auth: Auth = unref(inject('auth', {} as Auth))

const unreads = ref<Record<string, number>>({})
const allUnreads = computed(() => {
  return Object.values(unreads.value).reduce((a, b) => a + b, 0)
})

const { api } = useAPI(import.meta.env.VITE_API_URL, auth.user.username, auth.token)
const conversations = ref<Record<string, Conversation>>({})
const activeConvo = ref<(Conversation & User) | null>(null)

provide('activeConvo', activeConvo)

// [+] WS Subscriptions
api.onConnected((message: IMessage) => {
  switch (message.body) {
    case 'connected':
    case 'disconnected':
      api.getUsers().then((res) => {
        users.value = res
      })
      break
  }
})

api.onDirectMessage((message: IMessage) => {
  const msg = JSON.parse(message.body)
  if (!unreads.value[msg.username]) {
    unreads.value[msg.username] = 0
  }

  if (![activeConvo.value?.username, auth.user.username].includes(msg.username)) {
    unreads.value[msg.username] += 1
  }

  if (activeConvo.value?.id === msg.conversationId) {
    api.getConversationById(msg.conversationId).then((res) => {
      activeConvo.value!.messages = res.messages
      conversations.value[msg.username] = res
    })
  }
  nextTick(() => {
    msgbox.value?.scrollTo(msgbox.value?.scrollTop, msgbox.value.scrollHeight)
  })
})

api.onPublicMessage((message: IMessage) => {
  const msg = JSON.parse(message.body)
  if (activeConvo.value?.id == msg.conversationId) {
    api.getConversationById(msg.conversationId).then((res) => {
      activeConvo.value!.messages = res.messages
    })
  } else {
    if (!unreads.value[msg.conversationId]) {
      unreads.value[msg.conversationId] = 0
    }

    unreads.value[msg.conversationId] += 1
  }
  nextTick(() => {
    msgbox.value?.scrollTo(msgbox.value?.scrollTop, msgbox.value.scrollHeight)
  })
})

// [-] WS Subscriptions

api.getUsers().then((res) => {
  users.value = res
})

api.getDirectMessages().then((res) => {
  res.forEach((user) => {
    api.getConversation(user.username).then((convo) => {
      conversations.value[user.username] = convo
      unreads.value[user.username] = 0
    })
  })
})

api.getPublicChats().then((res) => {
  res.forEach((convo) => {
    if (convo.public) {
      publicChats.value.push(convo)
      unreads.value[convo.id] = 0
      conversations.value[convo.username] = convo
      return
    }
    api.getConversation(convo.username).then((convo) => {
      conversations.value[convo.username] = convo
    })
  })
})

const openConvo = async (convo: Conversation) => {
  const update = await api.getConversationById(convo.id)
  activeConvo.value = { ...auth.user, ...update }
  unreads.value[convo.id] = 0

  await nextTick()
  msgbox.value?.scrollTo(msgbox.value?.scrollTop, msgbox.value.scrollHeight)
}

const openChat = async (user: User) => {
  const res = await api.getConversation(user.username)
  if (res?.exists) {
    conversations.value[user.username] = res
  } else {
    const convo = await api.createConversation(user.username)
    conversations.value[user.username] = convo
  }
  activeConvo.value = { ...user, ...conversations.value[user.username] }
  unreads.value[user.username] = 0

  await nextTick()
  msgbox.value?.scrollTo(msgbox.value?.scrollTop, msgbox.value.scrollHeight)
}

const sendMessage = async (message: MessageRequest) => {
  if (!activeConvo.value) {
    return
  }

  api.sendMessage(message)
}

const updateUser = async (user: User) => {
  const res = await api.updateUser(user)
  auth.user = res
  editProfile.value = false
}

const updateUserImage = async (fd: FormData) => {
  await api.updateUserImage(fd)
  api.getUsers().then((res) => {
    users.value = res
  })
}

onMounted(() => {
  const msgBox = document.getElementById('msgBox')
  if (msgBox) {
    msgBox.scrollTop = msgBox.scrollHeight
  }
})
</script>
<style>
section {
  height: 80vh;
}
</style>
