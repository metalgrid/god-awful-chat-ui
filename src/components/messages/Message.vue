<template>
  <div class="flex flex-row p-2" :class="local ? 'local' : 'remote'">
    <div class="bg-gray-300 rounded-xl mb-2 p-3 relative">
      <p class="pb-3 pr-3 text-sm">
        {{ props.message.message }}
      </p>
      <span class="text-xs text-gray-500 absolute right-2 bottom-2">{{
        props.message.timeStamp
      }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Message } from '@/types'
import { defineProps } from 'vue'

const props = defineProps<{
  message: Message
  local: Boolean
}>()
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
