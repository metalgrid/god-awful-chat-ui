<template>
  <div class="w-full px-5 flex flex-col justify-between">
    <div class="flex flex-col mt-5">
      <message
        @highlight="addHighlight"
        :side="user.id == message.sender ? 'mine' : 'others'"
        v-for="message in messages"
        :key="message.id"
        :message="message"
      ></message>
    </div>
    <div class="flex py-5 relative">
      <input @keyup.enter="sendMessage" @paste="handlePaste" v-model="text" class="w-full bg-gray-200 py-2 px-3 rounded-xl" type="text" />
      <div class="flex justify-end self-center absolute right-1">
        <button
          @click.prevent="sendMessage"
          class="bg-blue-400 py-2 px-2 rounded-full text-white"
        >
          <send-icon></send-icon>
        </button>
      </div>
    </div>
  </div>
  <div class="xs:hidden sm:hidden lg:block w-2/5 border-l-2 px-5">
    <div class="flex flex-col">
      <div class="font-semibold text-center text-xl py-4">
        Chat highlights
        <p class="text-gray-500 text-sm italic">
          Lists files, images and links in this chat
        </p>
      </div>
      <div v-for="hl in highlights" :key="hl.timestamp">
        <div class="font-semibold py-4">{{hl.sender}} at {{ formatDate(hl.timestamp) }}</div>
        <div class="font-light">
          <span v-html="hl.highlight"></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, inject } from "vue";
import SendIcon from "../icons/SendIcon.vue";
import Message from "./MessageInstance.vue";

const user = inject("user");
let text = "";

const formatDate = (date) => {

  // Format the date and time in a short format
  const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' };
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
        messages.value.push({
          id: messages.value.length + 1,
          text: img,
          type: "image",
          sender: user.id,
        });
      };
      reader.readAsDataURL(blob);
    }
  }
}

const sendMessage = () => {
  if (!text.trim()) return;
  messages.value.push({
    id: messages.value.length + 1,
    text: text,
    sender: user.id,
  });
  console.log(messages);
  text = "";
};

const messages = ref([
  {
    id: 1,
    text: "Hello world",
    sender: "YTph",
  },
  {
    id: 2,
    text: "Howdy!",
    sender: "Yjpi",
  },
]);

const highlights = ref([]);

const addHighlight = (link) => {
  highlights.value.push(link);
};
</script>
