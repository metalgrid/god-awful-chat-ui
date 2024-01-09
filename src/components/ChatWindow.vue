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
      <user-component :user="auth.user"></user-component>
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
        <!-- chat rooms list -->
        <room-list @click="openChat"></room-list>
        <!-- end chat rooms list -->
        <!-- user list -->
        <user-list @click="openChat"></user-list>
        <!-- end user list -->
      </div>
      <!-- end chat list -->
      <!-- message -->
      <message-window @message="sendMessage" :conversation="conversations[convId]"></message-window>
      <!-- end message -->
    </div>
  </div>
</template>
<script setup>
import { provide, inject, ref, defineProps } from "vue";
import UserComponent from "./UserComponent.vue";
import UserList from "./chat/UserList.vue";
import RoomList from "./chat/RoomList.vue";
import MessageWindow from "./chat/MessageWindow.vue";
import { Stomp } from "@stomp/stompjs";

const auth = inject("auth");
const props = defineProps(["user"]);
const users = ref([]);
const convId = ref(0);

const conversations = ref({});

provide("convId", convId);
provide("user", props.user);
provide("users", users);

const openChat = async (chat) => {
  console.log("Opening chat", chat);
  let res;
  switch (chat.type) {
    case "room":
      await getMessages(chat.id);
      convId.value = chat.id;
      break;
    case "private":
      res = await fetch(
        `/api/v1/conversations/participants/${chat.username}/messages`,
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      if (res.status !== 200) {
        console.error("Fukup");
      }
      res = await res.json();
      if (res?.exists) {
        await getMessages(res.id);
        conversations.value[res.id].username = chat.username;
        convId.value = res.id;
      } else {
        newChat(chat);
      }
      break;
  }
};

const getMessages = async (convId) => {
  let data;
  const res = await fetch(
    `/api/v1/conversations/${convId}/messages`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    }
  );

  if (res.status === 200) {
    data = await res.json();
    conversations.value[convId] = data;
  } else {
    console.error("Could not retrieve messages: ", res.status);
  }
};

const stompClient = Stomp.client(`ws://${document.location.host}/ws-native`);

stompClient.connect(
  {},
  () => {
    let data;
    stompClient.subscribe(`/user/${auth.user.username}/private`, (msg) => {
      console.log("private message:", msg);
    });

    stompClient.subscribe("/chatroom/public", (msg) => {
      switch (msg.command) {
        case "MESSAGE":
          data = JSON.parse(msg.body);
          getMessages(data.conversationId);
          break;
        case "JOIN":
          console.log(msg);
          break;
        case "LEAVE":
          console.log(msg);
          break;
        default:
          break;
      }
      console.log(msg);
    });
  },
  (e) => {
    console.log("error", e);
  }
);


const sendMessage = async(payload) => {
  if (payload?.receiverName) {
    stompClient.send("/app/private-message", {}, JSON.stringify(payload));
  } else {
    stompClient.send("/app/message", {}, JSON.stringify(payload));
  }
}

// const sendMessage = async (text) => {
//   const payload = {
//     senderName: auth.user.username,
//     receiverName:
//     conversationId: convId,
//     message: text
//   }

// }

const newChat = async (user) => {
  const payload = {
    participants: [user.username],
  };
  const res = await fetch("/api/v1/conversations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${auth.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  switch (res.status) {
    case 200:
      console.log(await res.json());
      break;
    case 401:
      alert("Unauthorized");
      break;
    default:
      alert("Something went wrong");
      break;
  }
};
</script>
<style scoped></style>
