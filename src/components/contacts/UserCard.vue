<script setup lang="tsx">
import { formatDateTime } from '@/composables/utils'
import { type Message, type User } from '@/types'
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
    type: Object as PropType<Message>,
    default: null
  }
})

const emit = defineEmits(['click'])

function shash(s: String) {
  let char, i
  let hash = 0

  if (s.length == 0) return hash

  for (i = 0; i < s.length; i++) {
    char = s.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }

  return hash
}

const twColors = [
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone',
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose'
]

const getInitials = (name: String) => {
  return name
    .split(' ')
    .map((name) => name.charAt(0).toUpperCase())
    .join('')
}

const avatar = computed(() => {
  const initials = getInitials(props.user?.fullName || props.user.username)
  if (props.user?.profileImage?.length > 0) {
    return (
      <img
        src={`data:image/jpeg;base64,${props.user.profileImage}`}
        class="h-12 w-12 rounded-full mr-4 border-white border-2"
        alt="User Picture"
      />
    )
  } else {
    const color =
      twColors[Math.abs(shash(props.user?.fullName || props.user.username)) % twColors.length]

    return (
      <div
        class={`h-12 w-12 rounded-full mr-4 flex flex-row justify-center items-center bg-${color}-500 border-white border-2`}
      >
        <p class="text-white text-xl font-bold">{initials}</p>
      </div>
    )
  }
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
    @click="emit('click', props.user)"
    class="my-2 p-2 flex flex-row cursor-pointer rounded-lg"
    :class="props.active ? 'active' : 'default'"
  >
    <div class="relative">
      <avatar></avatar>
      <!-- <img
        v-if="props.user.profileImage.length > 0"
        :src="`data:image/jpeg;base64,${props.user.profileImage}`"
        class="h-12 w-12 rounded-full mr-4"
        alt="User Picture"
      />
      <div
        v-else
        class="h-12 w-12 rounded-full mr-4 bg-gray-300 flex flex-row justify-center items-center"
      >
        <p class="text-white text-xl">
          {{ initials }}
        </p>
      </div> -->

      <!-- status indicator -->
      <fa-icon
        :icon="status.icon"
        class="absolute w-3 h-3 bottom-1 right-1"
        :class="status.color"
      />
    </div>
    <div class="w-full flex flex-col justify-center">
      <div class="flex flex-row justify-between items-center">
        <h2 class="text-xs font-bold">
          {{ props.user?.fullName || props.user.username }}
        </h2>
        <div v-if="props.statusText" class="text-xs flex flex-row">
          <!-- <fa-icon :icon="['fas', 'check-double']" class="text-current mr-1" /> -->
          <span class="text-current"> {{ formatDateTime(props.statusText.timeStamp) }} </span>
        </div>
      </div>
      <div v-if="props.statusText" class="flex flex-row justify-between items-center">
        <p class="text-xs text-current">{{ props.statusText.message }}</p>
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
