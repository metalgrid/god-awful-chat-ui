<template>
  <div
    class="flex flex-row py-4 px-2 justify-center items-center border-b-2 hover:bg-gray-200 hover:cursor-pointer"
  >
    <div class="w-1/4">
      <img
        v-if="props.user.profileImage"
        :src="props.user.profileImage"
        class="object-cover h-12 w-12 rounded-full relative"
        :alt="props.user.username"
      />
      <div
        v-else
        :class="`bg-${getColor(props.user.username + props.user.id)}-500`"
        class="w-12 h-12 p-2 rounded-full relative text-white font-semibold flex items-center justify-center"
      >
        {{ getInitials(props.user.username) }}
      </div>
    </div>
    <div class="w-full">
      <div class="text-lg font-semibold">{{ props.user.username }}</div>
      <!-- <span class="text-gray-500">Pick me at 9:00 Am</span> -->
    </div>
  </div>
</template>
<script setup>
import { defineProps } from "vue";

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});


function shash(string) {
    let char, i;
    let hash = 0;

    if (string.length == 0) return hash;

    for (i = 0; i < string.length; i++) {
        char = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }

    return hash;
}

const twColors = [
  "slate",
  "gray",
  "zinc",
  "neutral",
  "stone",
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose"
];

const getColor = (string) => {
  const h = shash(string);
  const index = Math.abs(h) % twColors.length;
  return twColors[index-1];
}

const getInitials = (fullName) => {
  const allNames = fullName.trim().split(" ");
  const initials = allNames.reduce((acc, curr, index) => {
    if (index === 0 || index === allNames.length - 1) {
      acc = `${acc}${curr.charAt(0).toUpperCase()}`;
    }
    return acc;
  }, "");
  return initials;
};
</script>
