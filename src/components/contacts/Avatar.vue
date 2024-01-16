<script setup lang="tsx">
import type { User } from '@/types'
import { computed } from 'vue'

const props = defineProps<{
  user: User
}>()

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
</script>
<template>
  <avatar></avatar>
</template>
