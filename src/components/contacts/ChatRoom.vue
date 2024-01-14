<template>
  <li
    @click="emit('click', props.conversation)"
    class="my-2 p-2 flex flex-row cursor-pointer rounded-lg"
    :class="props.active ? 'active' : 'default'"
  >
    <div class="w-full flex flex-col justify-center">
      <div class="flex flex-row justify-between items-center">
        <h2 class="text-xs font-bold">
          {{ props.conversation.username }}
        </h2>
        <div class="text-xs flex flex-row">
          <span v-if="statusText?.timeStamp" class="text-current">
            {{ formatDateTime(statusText?.timeStamp) }}
          </span>
        </div>
      </div>
      <div v-if="statusText" class="flex flex-row justify-between items-center">
        <p class="text-xs text-current truncate">{{ statusText.message }}</p>
        <span
          v-if="props.badge > 0"
          class="text-sm bg-blue-500 rounded-full w-5 h-5 text-center text-white font-bold"
        >
          {{ props.badge }}
        </span>
      </div>
    </div>
  </li>
</template>
<script setup lang="ts">
import { formatDateTime } from "@/composables/utils";
import type { Conversation } from "@/types";
import { computed } from "vue";

const emit = defineEmits(["click"]);

const statusText = computed(() => {
  if (props.conversation.messages?.length === 0) return null;
  const lastIdx = props.conversation.messages.length - 1;
  const msg = props.conversation.messages?.[lastIdx];
  const from = msg.user.fullName || msg.user.username;
  if (msg.message.startsWith("data:image/")) {
    return {
      ...msg,
      message: `${from}: Sent an image`,
    };
  }
  if (msg.message.length > 50) {
    return {
      ...msg,
      message: `${from}: ${msg.message.substring(0, 50)}...`,
    };
  }
  return {
    ...msg,
    message: `${from}: ${msg.message}`,
  };
});

const props = defineProps<{
  conversation: Conversation;
  active: boolean;
  badge: number;
}>();
</script>
<style scoped>
* {
  transition: none !important;
}
.default {
  @apply hover:bg-gray-50 hover:bg-opacity-50;
}
.active {
  @apply bg-blue-500 text-white;
}
</style>
