<template>
  <div class="call">
  <video class="w-64 h-48 rounded-xl mx-auto my-5" id="localVideo" autoplay playsinline muted></video>
  <video id="remoteVideo" autoplay playsinline></video>
  </div>
</template>
<script setup>
const getLocalVideo = async () => {
  const localStream  = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  const localVideo = document.getElementById("localVideo");
  localVideo.srcObject = localStream;
}

getLocalVideo();
</script>
<style scoped>
.call {
  @apply fixed w-10/12 h-5/6 rounded-lg right-1/2 bottom-1/2 transform translate-x-1/2 translate-y-1/2 bg-white shadow-md;
}
</style>
