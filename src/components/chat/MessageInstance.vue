<template>
  <div :class="props.side == 'mine' ? 'right' : 'left'">
    <img
      v-if="props.side == 'others'"
      src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
      class="object-cover h-8 w-8 rounded-full"
      alt=""
    />
    <div :class="props.side">
      <p v-html="parseMessage(props.message)"></p>
    </div>
    <img
      v-if="props.side == 'mine'"
      src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
      class="object-cover h-8 w-8 rounded-full"
      alt=""
    />
  </div>
</template>
<script setup>
import { defineProps, defineEmits } from "vue";
const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
  side: {
    type: String,
    required: true,
  },
});

const emits = defineEmits(["highlight"]);

const parseMessage = (message) => {
  // Check if the message is an image
  if (message?.type == "image") {
    return renderImage(message);
  }
  return renderLinks(message);
};

const renderImage = (message) => {
  if (message?.type == "image") {
    const img = `<img src="${message.message}" class="w-64" />`;
    emits("highlight", {
      timestamp: new Date(),
      type: "image",
      highlight: img,
      sender: props.message.user,
    });
    return img;
  }
};

const renderLinks = (message) => {
  // Use a regular expression to match and replace links in the text
  const linkRegex = /(https?:\/\/[^\s]+)/g;
  let text = String(message.message);

  const links = text.match(linkRegex);

  links?.forEach((link) => {
    const ahref = `<a class="font-medium text-blue-600 dark:text-blue-700 underline" href="${link}" target="_blank">${link}</a>`;
    emits("highlight", {
      timestamp: new Date(),
      type: "link",
      highlight: ahref,
      sender: props.message.user,
    });
    text = text.replace(link, ahref);
  });

  return text;
};
</script>
<style scoped>
.right {
  @apply justify-end flex mb-4;
}

.left {
  @apply justify-start flex mb-4;
}

.mine {
  @apply mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white;
}
.others {
  @apply ml-2 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white;
}
</style>
