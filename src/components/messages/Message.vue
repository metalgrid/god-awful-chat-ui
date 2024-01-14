<template>
  <div class="flex flex-row p-2 max-w-96" :class="local ? 'local' : 'remote'">
    <div class="flex flex-col justify-end">
      <avatar class="w-8 h-8" v-if="!local" :user="props.message.user"></avatar>
    </div>
    <div class="bg-gray-300 rounded-xl mb-2 p-3 relative min-w-16">
      <message-body></message-body>
      <span class="text-xs text-gray-500 absolute right-2 bottom-2">{{
        formatDateTime(props.message.timeStamp)
      }}</span>
    </div>
  </div>
</template>
<script setup lang="tsx">
import { computed } from "vue";
import Avatar from "../contacts/Avatar.vue";
import type { MediaMessage, Message } from "@/types";

const emit = defineEmits<{
  "media:link": [message: MediaMessage],
  "media:image": [message: MediaMessage],
  "media:file": [message: MediaMessage],
}>();

// const parseMessage = (message: Message) => {
//   // Check if the message is an image
//   if (message?.type == "image") {
//     return renderImage(message);
//   }
//   return renderLinks(message);
// };

// const renderImage = (message: Message) => {
//   if (message?.type == "image") {
//     const img = `<img src="${message.message}" class="w-64" />`;
//     emits("highlight", {
//       timestamp: new Date(),
//       type: "image",
//       highlight: img,
//       sender: props.message.user,
//     });
//     return img;
//   }
// };

const messageBody = computed(() => {

  if (props.message.message.startsWith("data:image/")) {
    emit("media:image", {
      id: props.message.id,
      type: "image",
      user: props.message.user,
      timestamp: props.message.timeStamp,
      content: props.message.message,
    });
    return <img src={props.message.message} class="w-64" />;
  }

  const [linksFound, text] = renderLinks(props.message);
  if (linksFound) {
    // emit('media:link', {
    //   timestamp: new Date(),
    //   type: 'link',
    //   highlight: text,
    //   sender: props.message.user
    // })
    return <p class="pb-3 pr-3 text-sm" innerHTML={text}></p>;
  }
  return <p class="pb-3 pr-3 text-sm">{text}</p>;
});

const renderLinks = (message: Message): [number | undefined, string] => {
  // Use a regular expression to match and replace links in the text
  const linkRegex = /(https?:\/\/[^\s]+)/g;
  let text = String(message.message);

  const links = text.match(linkRegex);

  links?.forEach((link) => {
    const ahref = `<a class="font-medium text-blue-600 dark:text-blue-700 underline" href="${link}" target="_blank">${link}</a>`;
    emit("media:link", {
      id: message.id,
      type: "link",
      user: message.user,
      timestamp: message.timeStamp,
      content: ahref,
    });
    text = text.replace(link, ahref);
  });

  return [links?.length, text];
};

function formatDateTime(inputDateTime: string) {
  const messageDate = new Date(inputDateTime);
  const now = new Date();

  // If the message is from today
  if (
    messageDate.getDate() === now.getDate() &&
    messageDate.getMonth() === now.getMonth() &&
    messageDate.getFullYear() === now.getFullYear()
  ) {
    return messageDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  // If the message is from the last few days
  const timeDifference = now.getTime() - messageDate.getTime();
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  if (daysDifference < 7) {
    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayName = weekdays[messageDate.getDay()];
    return `${dayName}, ${messageDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  // If the message is older than a week
  return `${messageDate.toLocaleString("default", {
    month: "long",
  })} ${messageDate.getDate()}, ${messageDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

const props = defineProps<{
  message: Message;
  local: Boolean;
}>();
</script>
<style scoped>
.local {
  @apply justify-end;
}

.local > div {
  @apply bg-blue-500 text-white;
}

.local > div > span {
  @apply text-gray-300;
}

.remote {
  @apply w-11/12;
}
</style>
>
