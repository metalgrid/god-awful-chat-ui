import type { User } from '@/types'

// setup peer connection
export function usePC(user: User) {
  const pc = new RTCPeerConnection({
    iceServers: [
      {
        urls: 'stun:stun.l.google.com:19302'
      }
    ]
  })

  const senders = new Map<string, RTCRtpSender>()
  const receivers = new Map<string, RTCRtpReceiver>()

  pc.ontrack = (event) => {
    console.log('ontrack', event)
  }

  pc.onicecandidate = (event) => {
    console.log('onicecandidate', event)
  }

  pc.oniceconnectionstatechange = (event) => {
    console.log('oniceconnectionstatechange', event)
  }

  pc.onicegatheringstatechange = (event) => {
    console.log('onicegatheringstatechange', event)
  }

  pc.onnegotiationneeded = (event) => {
    console.log('onnegotiationneeded', event)
  }

  pc.onsignalingstatechange = (event) => {
    console.log('onsignalingstatechange', event)
  }

  pc.onconnectionstatechange = (event) => {
    console.log('onconnectionstatechange', event)
  }

  pc.ondatachannel = (event) => {
    console.log('ondatachannel', event)
  }

  pc.ontrack = (event) => {
    console.log('ontrack', event)
  }

  pc.onconnectionstatechange = (event) => {
    console.log('onconnectionstatechange', event)
  }

  pc.onicecandidateerror = (event) => {
    console.log('onicecandidateerror', event)
  }

  pc.onicegatheringstatechange = (event) => {
    console.log('onicegatheringstatechange', event)
  }

  pc.onnegotiationneeded = (event) => {
    console.log('onnegotiationneeded', event)
  }

  pc.onsignalingstatechange = (event) => {
    console.log('onsignalingstatechange', event)
  }
}
