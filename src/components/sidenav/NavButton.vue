<template>
  <li :class="active ? 'active' : 'default'" class="my-2 text-gray-500 cursor-pointer">
    <button
      class="flex flex-col justify-center items-center w-full p-2 rounded-lg hover:bg-gray-50 hover:bg-opacity-30 focus:outline-none focus:ring relative"
    >
      <fa-icon class="h-7 w-7" :icon="['fas', props.icon]" />

      <p class="text-xs font-semibold"><slot></slot></p>
      <span v-if="props.badge > 0"
        class="bg-blue-600 w-4 h-4 text-xs rounded-full text-white font-semibold absolute right-3 top-1"
        >{{props.badge}}</span
      >
    </button>
  </li>
</template>
<script setup lang="ts">
const props = defineProps({
  icon: {
    type: String,
    required: true
  },
  badge: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: false
  }
})
</script>
<style scoped>
.active {
    @apply my-2 text-gray-900
}

.active > button {
    @apply bg-gray-600 bg-opacity-10
}
</style>