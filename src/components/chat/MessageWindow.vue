<template>
  <div class="w-full px-5 flex flex-col justify-between">
    <div class="flex flex-col mt-5">
      <message
        @highlight="addHighlight"
        v-for="message in props.conversation?.messages"
        :key="message.id"
        :side="user.id == message.user.id ? 'mine' : 'others'"
        :message="message"
      ></message>
    </div>
    <p v-if="!props.conversation" class="text-center text-gray-500 italic py-5">
      Select a conversation
    </p>
    <div v-if="props.conversation" class="flex py-5 relative">
      <input
        @keyup.enter="sendMessage"
        @paste="handlePaste"
        v-model="text"
        class="w-full bg-gray-200 py-2 px-3 rounded-xl"
        type="text"
      />
      <div class="flex justify-end self-center absolute right-1">
        <button
          @click.prevent="sendMessage"
        >
          <fa-icon class=" text-blue-500 hover:text-blue-400 mr-2 rounded-full" icon="paper-plane"></fa-icon>
        </button>
      </div>
    </div>
  </div>
  <div v-if="props.conversation?.username" class="w-2/5 border-l-2 px-5">
    <user-component :user="{ username: props.conversation.username }"></user-component>
    <div class="flex justify-center">
      <button @click="inCall = true" class="bg-blue-400 hover:bg-blue-500 rounded-lg px-2 py-1 mx-2 text-white">
        <fa-icon :icon="['fas', 'phone']"></fa-icon>
      </button>
      <button class="bg-blue-400 hover:bg-blue-500 rounded-lg px-2 py-1 mx-2 text-white">
        <fa-icon icon="video"></fa-icon>
      </button>
    </div>
  </div>
  <div v-if="false" class="xs:hidden sm:hidden lg:block w-2/5 border-l-2 px-5">
    <div class="flex flex-col">
      <div class="font-semibold text-center text-xl py-4">
        Chat highlights
        <p class="text-gray-500 text-sm italic">
          Lists files, images and links in this chat
        </p>
      </div>
      <div v-for="hl in highlights" :key="hl.timestamp">
        <div class="font-semibold py-4">
          <user-component :id="hl.sender"></user-component>
          {{ hl.sender }} at {{ formatDate(hl.timestamp) }}
        </div>
        <div class="font-light">
          <span v-html="hl.highlight"></span>
        </div>
      </div>
    </div>
  </div>
  <video-call v-if="inCall"></video-call>
</template>
<script setup>
import { ref, inject, defineProps, defineEmits } from "vue";
import Message from "./MessageInstance.vue";
import UserComponent from "../UserComponent.vue";
import VideoCall from "@/components/VideoCall.vue"

const emit = defineEmits(["message"]);

const props = defineProps({
  conversation: {
    type: Object,
    required: true,
  },
});

const user = inject("user");

let text = "";
const inCall = ref(false);

const formatDate = (date) => {
  // Format the date and time in a short format
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  const formattedDateTime = date.toLocaleString(undefined, options);

  return formattedDateTime;
};

const handlePaste = (ev) => {
  const items = (ev.clipboardData || ev.originalEvent.clipboardData).items;

  for (const item of items) {
    const type = item.type;
    if (type.indexOf("image") !== -1) {
      const blob = item.getAsFile();
      const reader = new FileReader();
      reader.onload = function (event) {
        const img = event.target.result;
        console.log(img);
        // messages.value.push({
        //   id: messages.value.length + 1,
        //   text: img,
        //   type: "image",
        //   sender: user.id,
        // });
      };
      reader.readAsDataURL(blob);
    }
  }
};

const sendMessage = () => {
  if (!props?.conversation) return;
  if (!text.trim()) return;
  const payload = {
    message: text,
    conversationId: props.conversation.id,
    senderName: user.username,
  };
  if (!props.conversation.public) {
    payload.receiverName = props.conversation.username;
  }

  emit("message", payload);
  text = "";
};

const highlights = ref([]);

const addHighlight = (link) => {
  // console.log(link);
  highlights.value.push(link);
};
</script>
