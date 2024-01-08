<template>
  <div
    class="flex flex-row py-4 px-2 justify-center items-center border-b-2 hover:bg-gray-200"
  >
    <div class="w-1/4">
      <img
        v-if="user.profileImage"
        :src="user.profileImage"
        class="object-cover h-12 w-12 rounded-full relative"
        :alt="user.username"
      />
      <div
        v-else
        class="w-12 h-12 p-2 bg-yellow-500 rounded-full relative text-white font-semibold flex items-center justify-center"
      >
        {{ getInitials(user.username) }}
      </div>
    </div>
    <div class="w-full">
      <div class="text-lg font-semibold">{{ user.username }}</div>
      <!-- <span class="text-gray-500">Pick me at 9:00 Am</span> -->
    </div>
  </div>
</template>
<script setup>
import { defineProps, inject } from "vue";

const users = inject("users");
console.log("usercomponent", users);
let user = {
  id: 0,
  username: "Unknown user",
  profileImage: "",
};

for (const u of users) {
  if (u.id == props.id) {
    user = u;
    break;
  }
}

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});

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
