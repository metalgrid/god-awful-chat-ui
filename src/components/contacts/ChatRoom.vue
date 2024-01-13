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
          <fa-icon :icon="['fas', 'check-double']" class="text-current mr-1" />
          <span class="text-current"> 10:45 </span>
        </div>
      </div>
      <div v-if="statusText" class="flex flex-row justify-between items-center">
        <p class="text-xs text-current truncate">{{ statusText }}</p>
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
import type { Conversation } from "@/types";
import { computed } from "vue";

const emit = defineEmits(["click"]);

const statusText = computed(() => {
  if (props.conversation.messages.length === 0) return "";
  const mlen = props.conversation.messages.length - 1;
  return props.conversation.messages[mlen].message;
});

const props = defineProps<{
  conversation: Conversation;
  active: boolean;
  badge: number;
}>();
</script>
