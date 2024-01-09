<template>
  <user-component @click="emits('click', {type: 'private', ...user})" v-for="user in users" :key="user.id" :user="user"></user-component>
  
  <!--
        <div class="flex flex-row py-4 px-2 items-center border-b-2">
          <div class="w-1/4">
            <img
              src="https://source.unsplash.com/otT2199XwI8/600x600"
              class="object-cover h-12 w-12 rounded-full"
              alt=""
            />
          </div>
          <div class="w-full">
            <div class="text-lg font-semibold">Everest Trip 2021</div>
            <span class="text-gray-500">Hi Sam, Welcome</span>
          </div>
        </div>
        <div
          class="flex flex-row py-4 px-2 items-center border-b-2 border-l-4 border-blue-400"
        >
          <div class="w-1/4">
            <img
              src="https://source.unsplash.com/L2cxSuKWbpo/600x600"
              class="object-cover h-12 w-12 rounded-full"
              alt=""
            />
          </div>
          <div class="w-full">
            <div class="text-lg font-semibold">MERN Stack</div>
            <span class="text-gray-500">Lusi : Thanks Everyone</span>
          </div>
        </div>
        <div class="flex flex-row py-4 px-2 items-center border-b-2">
          <div class="w-1/4">
            <img
              src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
              class="object-cover h-12 w-12 rounded-full"
              alt=""
            />
          </div>
          <div class="w-full">
            <div class="text-lg font-semibold">Javascript Indonesia</div>
            <span class="text-gray-500">Evan : some one can fix this</span>
          </div>
        </div>
        <div class="flex flex-row py-4 px-2 items-center border-b-2">
          <div class="w-1/4">
            <img
              src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
              class="object-cover h-12 w-12 rounded-full"
              alt=""
            />
          </div>
          <div class="w-full">
            <div class="text-lg font-semibold">Javascript Indonesia</div>
            <span class="text-gray-500">Evan : some one can fix this</span>
          </div>
        </div>

        <div class="flex flex-row py-4 px-2 items-center border-b-2">
          <div class="w-1/4">
            <img
              src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
              class="object-cover h-12 w-12 rounded-full"
              alt=""
            />
          </div>
          <div class="w-full">
            <div class="text-lg font-semibold">Javascript Indonesia</div>
            <span class="text-gray-500">Evan : some one can fix this</span>
          </div>
        </div>-->
</template>
<script setup>
import UserComponent from "../UserComponent.vue";
import { inject, defineEmits } from "vue";

const users = inject("users");
const auth = inject("auth");

const emits = defineEmits(["click"]);

const getUsers = async () => {
  const res = await fetch("/api/v1/users", {
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
  });

  let data;

  switch (res.status) {
    case 200:
      data = await res.json();
      users.value = data?.content;
      break;
    case 401:
      alert("Unauthorized");
      break;
    default:
      alert("Something went wrong");
      break;
  }
};

getUsers();

// const getExistingChat = async (username) => {
//   let data;
//   const res = await fetch(
//     `http://localhost:8080/api/v1/conversations/participants/${username}/messages`,
//     {
//       headers: {
//         Authorization: `Bearer ${auth.token}`,
//         "Content-Type": "application/json",
//       },
//     });

//   switch (res.status) {
//     case 200:
//       data = await res.json();

//       if (data?.exists) {
//         console.log(data.messages);
//       }
//       break;
//     case 401:
//       alert("Unauthorized");
//       break;
//     default:
//       alert("Something went wrong");
//       break;
//   }
// }

// const openChat = async (user) => {
//   const payload = {
//     participants: [user.username],
//   };
//   const res = await fetch("/api/v1/conversations", {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${auth.token}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(payload),
//   });

//   switch (res.status) {
//     case 200:
//       console.log(await res.json());
//       break;
//     case 401:
//       alert("Unauthorized");
//       break;
//     default:
//       alert("Something went wrong");
//       break;
//   }
// };
</script>
