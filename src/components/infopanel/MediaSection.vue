<template>
  <div class="">
    <ul
      class="flex flex-row space-x-2 justify-between items-center text-gray-500 bg-gray-100 rounded-lg p-1"
    >
      <li
        @click="active = 'media'"
        class="switch"
        :class="active === 'media' ? 'active' : ''"
      >
        Media
      </li>
      <li
        @click="active = 'links'"
        class="switch"
        :class="active === 'links' ? 'active' : ''"
      >
        Links
      </li>
      <li
        @click="active = 'files'"
        class="switch"
        :class="active === 'files' ? 'active' : ''"
      >
        Files
      </li>
    </ul>
    <ul v-show="active === 'media'" class="grid grid-cols-3 gap-2 my-3">
      <li class="" v-for="image in props.media" :key="image.id">
        <img
          class="rounded-md"
          :src="image.content"
          :alt="`Image from ${
            image.user?.fullName ? image.user.fullName : image.user.username
          }`"
        />
      </li>
    </ul>
    <ul v-show="active === 'links'" class="flex flex-col gap-2 my-3">
      <li
        class="rounded bg-gray-100 p-2 flex flex-col items-center justify-between"
        v-for="link in props.links"
        :key="link.id"
      >
        <div class="flex flex-row items-center w-full justify-between">
          <avatar class="w-8 h-8" :user="link.user"></avatar>
          <span class="text-xs text-gray-500">{{ formatDateTime(link.timestamp) }}</span>
        </div>
        <p v-html="link.content"></p>
      </li>
    </ul>
  </div>
</template>
<style scoped>
.active {
  @apply bg-blue-500 text-white;
}

.switch {
  @apply w-full text-center rounded text-xs font-semibold px-3 py-1 cursor-pointer;
}

.switch:hover {
  @apply bg-gray-300 text-gray-500;
}
</style>
<script setup lang="ts">
import { ref } from "vue";
import type { MediaMessage } from "@/types";
import Avatar from "../contacts/Avatar.vue";
import { formatDateTime } from "@/composables/utils";

const active = ref("");
const props = defineProps<{
  links: MediaMessage[];
  files: MediaMessage[];
  media: MediaMessage[];
}>();
</script>
