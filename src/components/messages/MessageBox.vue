<template>
  <div class="flex flex-row justify-between items-center p-3">
    <div class="">
      <button
        type="button"
        class="p-2 text-gray-400 rounded-full hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring"
        aria-label="Send a file"
      >
        <fa-icon class="w-6 h-5" :icon="['fas', 'paperclip']"></fa-icon>
      </button>
    </div>
    <div class="flex-1 px-3">
      <input
        v-model="text"
        @keyup.enter="sendMessage"
        @paste="handlePaste"
        @drop="handleDrop"
        type="text"
        class="w-full border-2 border-gray-100 rounded-xl px-4 py-1 outline-none text-gray-500 focus:outline-none focus:ring"
        placeholder="Write a message..."
      />
      <div v-if="media" class="grid grid-cols-4 gap-2 mt-2">
        <div class="relative" v-for="item in media" :key="item.id">
          <fa-icon class="absolute bottom-0 right-0 w-4 h-4 bg-gray-50 rounded-full translate-x-2 translate-y-2" @click.prevent="media.splice(media.indexOf(item), 1)" :icon="['fas', 'times']" />
          <img
            v-if="item.type === 'image'"
            :src="item.content"
            class="rounded-md w-48"
          />
        </div>
      </div>
    </div>
    <div class="flex flex-row">
      <button
        type="button"
        class="p-2 text-gray-400 rounded-full hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring"
        aria-label="Show emojis"
      >
        <fa-icon class="w-6 h-5" :icon="['far', 'face-smile']" />
      </button>
      <button
        type="button"
        class="p-2 ml-2 text-gray-400 rounded-full hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring"
        aria-label="Record a voice"
      >
        <fa-icon class="w-6 h-5" :icon="['fas', 'microphone']" />
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Auth, Conversation, MessageRequest, User } from '@/types'
import { inject, ref, unref, type Ref } from 'vue'
const auth = unref(inject<Auth>('auth'))
const convo = inject<Ref<Conversation & User>>('activeConvo')
const text = ref('')

type Media = {
  id: number
  type: 'image' | 'video' | 'file'
  content: string | undefined
}

const media = ref<Media[]>([])

const emit = defineEmits<{
  message: [MessageRequest]
}>()

const sendMessage = () => {
  if (text.value.trim().length === 0) return
  if (text.value.trim().length > 1000) return
  if (!convo) return

  emit('message', {
    message: text.value.trim(),
    senderName: auth!.user.username,
    conversationId: convo.value.id,
    receiverName: convo.value.public ? null : convo.value.username
  })
  text.value = ''
}

const handleDrop = (ev: DragEvent) => {
  ev.preventDefault()
  const files = ev.dataTransfer?.files || []
  for (const file of files) {
    if (file.type.indexOf('image') === -1) continue
    const reader = new FileReader()
    reader.onload = function () {
      media.value.push({id: media.value.length, content: reader.result?.toString(), type: 'image'})
    }
    reader.readAsDataURL(file)
  }
}

const handlePaste = (ev: ClipboardEvent) => {
  const items = ev.clipboardData?.items || []

  for (const item of items) {
    const type = item.type;
    if (type.indexOf("image") !== -1) {
      const blob = item.getAsFile();
      const reader = new FileReader();
      reader.onload = function () {
        media.value.push({id: media.value.length, content: reader.result?.toString(), type: 'image'});
        // messages.value.push({
        //   id: messages.value.length + 1,
        //   text: img,
        //   type: "image",
        //   sender: user.id,
        // });
      };
      if (blob) {
        reader.readAsDataURL(blob);
      }
    }
  }
};
</script>
