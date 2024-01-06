<template>
  <div
    v-for="user in users"
    :key="user.id"
    class="xs:hidden sm:hidden lg:flex flex-row py-4 px-2 justify-center items-center border-b-2 hover:bg-gray-200"
    @click="kys(user)"
  >
    <div class="w-1/4">
      <div
        class="w-12 h-12 p-2 bg-yellow-500 rounded-full relative text-white font-semibold flex items-center justify-center"
      >
        {{ getInitials(user.username) }}
        <div
          :class="status(user.status)"
          class="h-3 w-3 rounded-full absolute bottom-0 right-0"
        ></div>
      </div>
    </div>
    <div class="w-full">
      <div class="text-lg font-semibold">{{ user.username }}</div>
      <!-- <span class="text-gray-500">Pick me at 9:00 Am</span> -->
    </div>
  </div>
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
const users = [
  {
    id: 1,
    username: "Sam",
    status: "online",
  },
  {
    id: 2,
    username: "Lusi",
    status: "offline",
  },
  {
    id: 3,
    username: "Evan",
    status: "dnd",
  },
];

const kys = (user) => {
  alert(`Chatting with ${user.username}`);
};

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

const status = (status) => {
  switch (status) {
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
</script>
