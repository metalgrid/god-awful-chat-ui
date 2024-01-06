<template>
  <!-- component -->
  <!-- This is an example component -->
  <div class="container mx-auto shadow-lg rounded-lg">
    <!-- headaer -->
    <div class="px-5 py-5 flex justify-between items-center bg-white border-b-2">
      <div class="font-semibold text-2xl">DSChat</div>
      <div class="w-1/2">
        <input
          type="text"
          name=""
          id=""
          placeholder="search IRL"
          class="rounded-2xl bg-gray-100 py-3 px-5 w-full"
        />
      </div>
      <div
        @click.prevent="setStatus()"
        class="h-12 w-12 p-2 bg-yellow-500 rounded-full relative text-white font-semibold flex items-center justify-center"
      >
        {{ getInitials() }}
        <div
          :class="status()"
          class="h-3 w-3 rounded-full absolute bottom-0 left-0"
        ></div>
      </div>
    </div>
    <!-- end header -->
    <!-- Chatting -->
    <div class="flex flex-row justify-between bg-white">
      <!-- chat list -->
      <div class="flex flex-col w-2/5 border-r-2 overflow-y-auto">
        <!-- search compt -->
        <div class="border-b-2 py-4 px-2">
          <input
            type="text"
            placeholder="search chatting"
            class="py-2 px-2 border-2 border-gray-200 rounded-2xl w-full"
          />
        </div>
        <!-- end search compt -->
        <!-- user list -->
        <user-list></user-list>
        <!-- end user list -->
      </div>
      <!-- end chat list -->
      <!-- message -->
      <message-window></message-window>
      <!-- end message -->
    </div>
  </div>
</template>
<script setup>
import { provide } from "vue";
import UserList from "./chat/UserList.vue";
import MessageWindow from "./chat/MessageWindow.vue";
import { inject } from "vue";
const user = inject("user");

provide("user", user);

const getInitials = () => {
  const fullName = user.username;
  const allNames = fullName.trim().split(" ");
  const initials = allNames.reduce((acc, curr, index) => {
    if (index === 0 || index === allNames.length - 1) {
      acc = `${acc}${curr.charAt(0).toUpperCase()}`;
    }
    return acc;
  }, "");
  return initials;
};

const status = () => {
  switch (user.status) {
    case "online":
      return "bg-green-500";
    case "offline":
      return "bg-gray-500";
    case "dnd":
      return "bg-red-500";
    default:
      return "bg-yellow-500";
  }
};

const setStatus = () => {
  switch (user.status) {
    case "online":
      user.status = "dnd";
      break;
    case "dnd":
      user.status = "offline";
      break;
    default:
      user.status = "online";
      break;
  }
};
</script>
<style scoped></style>
