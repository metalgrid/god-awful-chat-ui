<script setup lang="ts">
import type { User, Conversation, MediaMessage } from "@/types";
import Avatar from "@/components/contacts/Avatar.vue";
import MediaSection from "./MediaSection.vue";
import { inject } from "vue";
const activeConvo = inject("activeConvo") as User & Conversation;
const props = defineProps<{
  users: User[];
  links: MediaMessage[];
  files: MediaMessage[];
  media: MediaMessage[];
}>();

const getUser = (username: string) => {
  if (!props.users) return null;
  if (!username) return null;
  return props.users.find((user) => user.username === username);
};
</script>
<template>
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
      <div
        v-if="activeConvo?.username"
        class="my-4 flex flex-col items-center justify-center"
      >
        <avatar class="w-24 h-24" :user="getUser(activeConvo?.username)!"></avatar>
        <h2 class="text-center text-xl font-semibold">
          {{ activeConvo?.fullName || activeConvo?.username }}
        </h2>
      </div>
      <div v-if="!activeConvo?.public" class="my-6">
        <ul class="flex flex-row justify-center items-center">
          <li>
            <button
              type="button"
              class="flex flex-col justify-center items-center p-2 m-2 w-16 h-16 text-gray-400 rounded-full hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring"
            >
              <fa-icon class="h-6 w-6 mb-2" :icon="['fas', 'phone']"></fa-icon>
              <p class="text-xs font-semibold">Call</p>
            </button>
          </li>
          <li>
            <button
              type="button"
              class="flex flex-col justify-center items-center p-2 m-2 w-16 h-16 text-gray-400 rounded-full hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring"
            >
              <fa-icon class="h-6 w-6 mb-2" :icon="['fas', 'video']"></fa-icon>
              <p class="text-xs font-semibold">Video</p>
            </button>
          </li>
        </ul>
      </div>
      <media-section :links="links" :files="files" :media="media"></media-section>
    </main>
  </div>
</template>
