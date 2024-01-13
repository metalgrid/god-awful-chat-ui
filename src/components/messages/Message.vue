<template>
  <div class="flex flex-row p-2" :class="local ? 'local' : 'remote'">
    <div class="bg-gray-300 rounded-xl mb-2 p-3 relative">
      <p class="pb-3 pr-3 text-sm">
        {{ props.message.message }}
      </p>
      <span class="text-xs text-gray-500 absolute right-2 bottom-2">{{
        formatDateTime(props.message.timeStamp)
      }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Message } from '@/types'

function formatDateTime(inputDateTime: string) {
  const messageDate = new Date(inputDateTime)
  const now = new Date()

  // If the message is from today
  if (
    messageDate.getDate() === now.getDate() &&
    messageDate.getMonth() === now.getMonth() &&
    messageDate.getFullYear() === now.getFullYear()
  ) {
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  // If the message is from the last few days
  const timeDifference = now.getTime() - messageDate.getTime()
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24))

  if (daysDifference < 7) {
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const dayName = weekdays[messageDate.getDay()]
    return `${dayName}, ${messageDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })}`
  }

  // If the message is older than a week
  return `${messageDate.toLocaleString('default', {
    month: 'long'
  })} ${messageDate.getDate()}, ${messageDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })}`
}

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
