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
                <div
                  class="p-1 flex justify-center items-center text-gray-500 cursor-pointer"
                >
                  <button
                    class="flex flex-col justify-center items-center w-full p-1 rounded-lg hover:bg-gray-50 hover:bg-opacity-30 focus:outline-none focus:ring"
                    aria-label="Hamburger menu"
                  >
                    <fa-icon class="h-5 w-5" :icon="['fas', 'bars']" />
                  </button>
                </div>
                <ul class="">
                  <nav-button icon="comments" :badge="allUnreads" active
                    >All chats</nav-button
                  >
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
                  @click="openConvo(chat)"
                  v-for="chat in publicChats"
                  :key="chat.id"
                  :conversation="chat"
                  :active="activeConvo !== null && chat.id === activeConvo.id"
                  :badge="unreads[chat.id]"
                ></chat-room>
                <user-card
                  @click="
                    () => {
                      openChat(user);
                    }
                  "
                  v-for="user in users"
                  :key="user.id"
                  :user="user"
                  :status-text="getStatusText(user.username)"
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
              @media:link="
                (e) => {
                  console.log(e);
                  links.push(e);
                }
              "
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
      <info-panel
        :links="links"
        :files="files"
        :media="media"
        :users="users"
      ></info-panel>
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
import NavButton from "@/components/sidenav/NavButton.vue";
import SearchBox from "@/components/contacts/SearchBox.vue";
import ChatRoom from "@/components/contacts/ChatRoom.vue";
import UserCard from "@/components/contacts/UserCard.vue";
import Message from "@/components/messages/Message.vue";
import MessageBox from "@/components/messages/MessageBox.vue";
import Profile from "@/components/profile/Profile.vue";
import InfoPanel from "@/components/infopanel/InfoPanel.vue";
import { useAPI } from "@/composables/api";

import { inject, ref, unref, provide, computed, onMounted, nextTick } from "vue";
import type {
  Auth,
  Conversation,
  MessageRequest,
  User,
  Message as ChatMessage,
  MediaMessage,
} from "@/types";
import type { IMessage } from "@stomp/stompjs";
const search = ref("");
const users = ref<User[]>([]);
const publicChats = ref<Conversation[]>([]);
const editProfile = ref(false);

const msgbox = ref<HTMLDivElement | null>(null);

const auth: Auth = unref(inject("auth", {} as Auth));

const unreads = ref<Record<string, number>>({});
const allUnreads = computed(() => {
  return Object.values(unreads.value).reduce((a, b) => a + b, 0);
});

const { api } = useAPI(import.meta.env.VITE_API_URL, auth.user.username, auth.token);
const conversations = ref<Record<string, Conversation>>({});
const activeConvo = ref<(Conversation & User) | null>(null);

provide("activeConvo", activeConvo);

// [+] WS Subscriptions
api.onConnected((message: IMessage) => {
  switch (message.body) {
    case "connected":
    case "disconnected":
      api.getUsers().then((res) => {
        users.value = res;
      });
      break;
  }
});

api.onDirectMessage((message: IMessage) => {
  const msg = JSON.parse(message.body);
  if (!unreads.value[msg.username]) {
    unreads.value[msg.username] = 0;
  }

  if (![activeConvo.value?.username, auth.user.username].includes(msg.username)) {
    unreads.value[msg.username] += 1;
  }

  if (activeConvo.value?.id === msg.conversationId) {
    api.getConversationById(msg.conversationId).then((res) => {
      activeConvo.value!.messages = res.messages;
      conversations.value[msg.username] = res;
      links.value = [];
      nextTick(() => {
        msgbox.value?.scrollTo(msgbox.value?.scrollTop, msgbox.value.scrollHeight);
      });
    });
  }
});

api.onPublicMessage((message: IMessage) => {
  const msg = JSON.parse(message.body);
  if (activeConvo.value?.id == msg.conversationId) {
    api.getConversationById(msg.conversationId).then((res) => {
      activeConvo.value!.messages = res.messages;
      nextTick(() => {
        msgbox.value?.scrollTo(msgbox.value?.scrollTop, msgbox.value.scrollHeight);
      });
    });
  } else {
    if (!unreads.value[msg.conversationId]) {
      unreads.value[msg.conversationId] = 0;
    }

    unreads.value[msg.conversationId] += 1;
  }
});

// [-] WS Subscriptions

api.getUsers().then((res) => {
  users.value = res;
});

api.getDirectMessages().then((res) => {
  res.forEach((user) => {
    api.getConversation(user.username).then((convo) => {
      conversations.value[user.username] = convo;
      unreads.value[user.username] = 0;
    });
  });
});

api.getPublicChats().then((res) => {
  res.forEach((convo) => {
    if (convo.public) {
      publicChats.value.push(convo);
      unreads.value[convo.id] = 0;
      conversations.value[convo.username] = convo;
      return;
    }
    api.getConversation(convo.username).then((convo) => {
      conversations.value[convo.username] = convo;
    });
  });
});

const openConvo = async (convo: Conversation) => {
  const update = await api.getConversationById(convo.id);
  activeConvo.value = { ...auth.user, ...update };
  unreads.value[convo.id] = 0;
  
  await nextTick();
  [links.value, media.value, files.value] = [[], [], []];
  msgbox.value?.scrollTo(msgbox.value?.scrollTop, msgbox.value.scrollHeight);
};

const openChat = async (user: User) => {
  const res = await api.getConversation(user.username);
  if (res?.exists) {
    conversations.value[user.username] = res;
  } else {
    const convo = await api.createConversation(user.username);
    conversations.value[user.username] = convo;
  }
  activeConvo.value = { ...user, ...conversations.value[user.username] };
  unreads.value[user.username] = 0;
  
  await nextTick();
  [links.value, media.value, files.value] = [[], [], []];
  msgbox.value?.scrollTo(msgbox.value?.scrollTop, msgbox.value.scrollHeight);
};

const sendMessage = async (message: MessageRequest) => {
  if (!activeConvo.value) {
    return;
  }

  api.sendMessage(message);
};

const updateUser = async (user: User) => {
  const res = await api.updateUser(user);
  auth.user = res;
  editProfile.value = false;
};

const updateUserImage = async (fd: FormData) => {
  await api.updateUserImage(fd);
  api.getUsers().then((res) => {
    users.value = res;
  });
};

const getStatusText = (username: string): ChatMessage | undefined => {
  if (!conversations.value[username]?.messages) {
    return undefined;
  }

  const lastIdx = conversations.value[username].messages.length - 1;
  return conversations.value[username]?.messages?.[lastIdx];
};

onMounted(() => {
  if (msgbox.value) {
    msgbox.value.scrollTop = msgbox.value.scrollHeight;
  }
});

// Stuff for the info panel
const links = ref<MediaMessage[]>([]);
const media = ref<MediaMessage[]>([]);
const files = ref<MediaMessage[]>([]);
</script>
<style>
section {
  height: 80vh;
}
</style>
