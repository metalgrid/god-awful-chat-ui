<template>
  <div class="flex flex-row justify-between items-center p-3">
    <div class="">
      <button
        type="button"
        class="p-2 text-gray-400 rounded-full hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring"
        aria-label="Send a file"
      >
        <fa-icon class="w-6 h-5" :icon="['fas', 'paperclip']"></fa-icon>
      </button>
    </div>
    <div class="flex-1 px-3">
      <input
        v-model="text"
        @keyup.enter="sendMessage"
        type="text"
        class="w-full border-2 border-gray-100 rounded-xl px-4 py-1 outline-none text-gray-500 focus:outline-none focus:ring"
        placeholder="Write a message..."
      />
    </div>
    <div class="flex flex-row">
      <button
        type="button"
        class="p-2 text-gray-400 rounded-full hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring"
        aria-label="Show emojis"
      >
        <fa-icon class="w-6 h-5" :icon="['far', 'face-smile']" />
      </button>
      <button
        type="button"
        class="p-2 ml-2 text-gray-400 rounded-full hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring"
        aria-label="Record a voice"
      >
        <fa-icon class="w-6 h-5" :icon="['fas', 'microphone']" />
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
let text;
import { defineEmits, inject, unref } from "vue";
const auth = unref(inject<Auth>("auth"));
const convo = unref(inject<Conversation>("activeConvo"));

// const formatDate = (date: Date) => {
//   // Format the date and time in a short format
//   const options = {
//     year: "numeric",
//     month: "numeric",
//     day: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   };

//   const formattedDateTime = date.toLocaleString(undefined, options);

//   return formattedDateTime;
// };

const emit = defineEmits<{
  message: (message: Message) => void;
}>();

const sendMessage = () => {
    if (text.trim().length === 0) return;
    emit('message', {
        message: text.trim(),
        senderName: auth.user.name,
        conversationId: convo.id,
    })
}

</script>