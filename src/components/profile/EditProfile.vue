<template>
  <div class="element flex flex-row items-center justify-center">
    <fa-icon :icon="['fas', 'id-card']"></fa-icon>
    <h2>Edit profile</h2>
    <hr />
  </div>
</template>
<script setup lang="ts"></script>
<style scoped>
.element {
  @apply bg-white bg-opacity-80 rounded-lg shadow-lg p-6;
}

input {
  @apply bg-gray-600 bg-opacity-10 placeholder-gray-500 text-gray-400 text-sm py-1 px-10 rounded-md outline-none w-full focus:outline-none focus:ring;
  @apply text-slate-500;
}

button {
  @apply my-2 p-2 flex flex-row justify-center items-center text-white bg-blue-500 rounded-lg cursor-pointer;
  /* @apply flex flex-col justify-center items-center border-gray-100 border p-2 rounded-lg bg-gray-50 bg-opacity-30 focus:outline-none focus:ring; */
  @apply hover:bg-blue-700 hover:border-blue-400;
  @apply font-bold text-sm;
}

button:disabled {
  @apply bg-gray-200 bg-opacity-80 border-gray-100 border text-gray-400;
  @apply cursor-not-allowed;
}

a {
  @apply text-blue-700;
  @apply cursor-pointer;
}

a:hover {
  @apply text-indigo-700;
}
</style>
