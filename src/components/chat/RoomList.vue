<template>
    <div
    v-for="room in rooms"
    @click="emits('click', {type: 'room', ...room})"
    :key="room.id"
    class="flex flex-row py-4 px-2 justify-center items-center border-b-2 hover:bg-gray-200 hover:cursor-pointer"
  >
    <div class="w-1/4">
      <div
        class="w-12 h-12 p-2 bg-green-700 rounded-full relative text-white font-semibold flex items-center justify-center"
      >
      </div>
    </div>
    <div class="w-full">
      <div class="text-lg font-semibold">Chat Room {{ room.id }}</div>
      <!-- <span class="text-gray-500">Pick me at 9:00 Am</span> -->
    </div>
  </div>
</template>
<script setup>
import { inject, ref, defineEmits } from "vue";

const emits = defineEmits(["click"]);

const auth = inject("auth");

const rooms = ref([]);

const getRooms = async () => {
    const res = await fetch("/api/v1/conversations/public", {
        headers: {
            Authorization: `Bearer ${auth.token}`,
        },
    });

    switch (res.status) {
        case 200:
            rooms.value = await res.json();
            break;
        case 401:
            alert("Unauthorized");
            break;
        default:
            alert("Something went wrong");
            break;
    }
}

getRooms();
</script>