<script setup lang="ts">
import { type User } from '@/types'
import { computed, type PropType } from 'vue'

const props = defineProps({
  user: {
    type: Object as PropType<User>,
    required: true
  },
  badge: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: false
  },
  statusText: {
    type: String,
    default: ''
  }
})

const avatar = computed(() => {
  if (props.user.profileImage) {
    return `data:image/jpeg;base64,${props.user.profileImage}`
  }

  return props.user.fullName
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .join('')
})

const status = computed(() => {
  switch (props.user?.status) {
    case 'online':
      return {
        color: 'text-green-500',
        icon: ['fas', 'circle']
      }
    case 'offline':
      return {
        color: 'text-gray-500',
        icon: ['far', 'circle']
      }
    case 'dnd':
      return {
        color: 'text-red-500',
        icon: ['fas', 'circle-minus']
      }
    default:
      return {
        color: 'text-gray-500',
        icon: ['far', 'circle']
      }
  }
})
</script>
<template>
  <li
    class="my-2 p-2 flex flex-row cursor-pointer rounded-lg"
    :class="props.active ? 'active' : 'default'"
  >
    <div class="relative">
      <img
        :src="`data:image/jpeg;base64,${props.user.profileImage}`"
        class="h-12 w-12 rounded-full mr-4"
        alt=""
      />
      <!-- status indicator -->
      <fa-icon
        :icon="status.icon"
        class="absolute w-3 h-3 bottom-1 right-1"
        :class="status.color"
      />
    </div>
    <div class="w-full flex flex-col justify-center">
      <div class="flex flex-row justify-between items-center">
        <h2 class="text-xs font-bold">{{ props.user.fullName }}</h2>
        <div class="text-xs flex flex-row">
          <fa-icon :icon="['fas', 'check-double']" class="text-current mr-1" />
          <span class="text-current"> 10:45 </span>
        </div>
      </div>
      <div v-if="props.statusText" class="flex flex-row justify-between items-center">
        <p class="text-xs text-current">{{ props.statusText }}</p>
        <span
          v-if="props.badge > 0"
          class="text-sm bg-blue-500 rounded-full w-5 h-5 text-center text-white font-bold"
          >{{ props.badge }}</span
        >
      </div>
    </div>
  </li>
</template>
<style scoped>
.default {
  @apply hover:bg-gray-50 hover:bg-opacity-50;
}
.active {
  @apply bg-blue-500 text-white;
}
</style>
