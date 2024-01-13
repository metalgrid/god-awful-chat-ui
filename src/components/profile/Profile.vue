<template>
  <div
    class="fixed inset-0 bg-gray-900 bg-opacity-50 flex flex-col justify-center items-center"
  >
    <div class="element flex flex-col items-center justify-center">
      <div class="ml-12 w-full">
        <h2 class="text-lg text-gray-500">
          <fa-icon :icon="['fas', 'id-card']"></fa-icon> Edit profile
        </h2>
      </div>
      <div class="flex flex-col justify-center items-center">
        <img
          class="w-24 h-24 rounded-full"
          :src="avatar"
          alt="avatar"
        />
        <p class="font-bold justify-center">{{ userProfile.fullName }}</p>
      </div>
      <div class="w-full relative">
        <span class="absolute left-3 top-1/4 -translate-y-1/4"
          ><fa-icon class="text-gray-400" :icon="['fas', 'user']"></fa-icon
        ></span>
        <input type="text" placeholder="Full Name" v-model="userProfile.fullName" />
      </div>
      <div class="w-full relative">
        <span class="absolute left-3 top-1/4 -translate-y-1/4"
          ><fa-icon class="text-gray-400" :icon="['fas', 'camera']"></fa-icon
        ></span>
        <input type="file" @change="updateAvatar" placeholder="Avatar" />
      </div>
      <p v-if="passwordFocused" class="text-sm text-gray-500">
        To change your password, provide your old password with the new one
      </p>
      <div class="w-full flex flex-row space-x-2 justify-center items-center">
        <div class="w-full relative">
          <span class="absolute left-3 top-1/4 -translate-y-1/4"
            ><fa-icon class="text-gray-400" :icon="['fas', 'key']"></fa-icon
          ></span>
          <input
            @focus="passwordFocused = true"
            @blur="passwordFocused = false"
            type="password"
            placeholder="Old Password"
            v-model="password.oldPassword"
          />
        </div>
        <div class="w-full relative">
          <span class="absolute left-3 top-1/4 -translate-y-1/4"
            ><fa-icon class="text-gray-400" :icon="['fas', 'key']"></fa-icon
          ></span>
          <input
            @focus="passwordFocused = true"
            @blur="passwordFocused = false"
            type="password"
            placeholder="New Password"
            v-model="password.newPassword"
          />
        </div>
      </div>
      <div class="flex flex-row space-x-2">
        <button @click="updateProfile">Save</button>
        <button @click="emit('close')">Cancel</button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { User } from "@/types";
import { ref } from "vue";
const passwordFocused = ref(false);
const props = defineProps<{ user: User }>();
const avatar = ref('');
const fd = new FormData();
const userProfile = ref<User>({
  id: props.user.id,
  fullName: props.user.fullName,
  username: props.user.username,
  profileImage: props.user.profileImage,
  status: props.user.status,
});

const password = ref({
  oldPassword: "",
  newPassword: "",
});

const emit = defineEmits(["close", "update:user", "update:avatar"]);

const updateAvatar = (ev: Event) => {
  
  const newAvatar = (ev.target as HTMLInputElement).files?.item(0);

  if (newAvatar) {
    fd.append("file", newAvatar);
  }

  const reader = new FileReader();
  reader.readAsDataURL(newAvatar as Blob);
  reader.onload = () => {
    avatar.value = reader.result as string;
  };
}

const updateProfile = () => {

  if (fd.has('file')) {
    emit("update:avatar", fd);
  }

  if (!!password.value.oldPassword && !!password.value.newPassword) {
    emit ("update:user", {
      ...userProfile.value,
      ...password.value
    });
    return
  }
  emit("update:user", userProfile.value);
};
</script>
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
