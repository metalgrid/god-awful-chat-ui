<template>
  <div>
    <video class="localVideo" ref="localVideo" autoplay muted></video>
  </div>
</template>
<style scoped>
.localVideo {
  @apply w-full h-full rounded-xl border-2 border-blue-500;
}
</style>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
// get the camera and microphone and set them inside the localVideo element
const localVideo = ref<HTMLVideoElement | null>(null)
const getLocalVideo = async () => {
  try {
    const stream = await navigator.mediaDevices?.getUserMedia({
      video: false,
      audio: true
    })
    if (localVideo.value) {
      localVideo.value.srcObject = stream
    }
  } catch (err) {
    console.error(err)
  }
}
onMounted(() => {
  getLocalVideo()
})
</script>
