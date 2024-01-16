import { type User } from '@/types'
import { CompatClient, type IMessage } from '@stomp/stompjs'

export type Invite = {
  offer: RTCSessionDescriptionInit
  UUID: string
  caller: User
}

export type Answer = {
  answer: RTCSessionDescriptionInit
  UUID: string
  callee: User
}

export enum CallEvent {
  INCOMING_CALL = 'invite',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  HANGUP = 'hangup',
  ICE_CANDIDATE = 'ice-candidate',
  OFFER = 'offer',
  ANSWER = 'answer'
}

export interface CallAPI {
  on: (event: CallEvent, callback: Function) => void
  call: (username: string) => void
  accept: (invite: Invite) => void
}

const callbacks: Map<string, Function[]> = new Map()

export async function useCall(me: User, stompClient: CompatClient): Promise<CallAPI> {
  const registerCallbacks = () => {
    if (stompClient.connected) {
      for (const [event, cbs] of callbacks.entries()) {
        stompClient.subscribe(`/user/${me.username}/${event}`, async (message) => {
          cbs.forEach((cb) => cb(JSON.parse(message.body)))
          // Empty the callbacks array so that we don't register the same callback twice in subsequent calls
          cbs.length = 0
        })
      }
    }
    stompClient.onConnect = registerCallbacks
  }

  const promise: Promise<CallAPI> = new Promise<CallAPI>((resolve, reject) => {
    if (!stompClient) {
      reject(Error('STOMP communication socket is not provided!'))
    }

    const api = {
      on: (event: CallEvent, callback: Function) => {
        console.log(`Registering callback for ${event}`)

        if (!Object.values(CallEvent).includes(event)) {
          throw new Error(`Unknown event: ${event}`)
        }

        if (!callbacks.has(event)) {
          callbacks.set(event, [])
        }

        callbacks.get(event)?.push(callback)

        registerCallbacks()
      },

      call: async (username: string) => {
        if (!stompClient.connected) {
          throw new Error('STOMP communication socket is not connected!')
        }

        const localUUID = crypto.randomUUID()
        console.log('Initiating Call UUID', localUUID, 'to', username)

        const localICECandidates: RTCIceCandidate[] = []
        const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] })
        pc.onsignalingstatechange = () => {
          // exchange ICE candidates
          console.log('[caller] RTC Signaling state changed to:', pc.signalingState)
        }
        pc.onnegotiationneeded = () => {
          console.log('[caller] RTC Negotiation needed')
        }
        pc.onconnectionstatechange = () => {
          console.log('[caller] RTC Connection state changed to:', pc.connectionState)
        }

        pc.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
          console.log('[caller] Got local ICE candidate', event.candidate)
        }

        const streams = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        streams.getTracks().forEach((track) => pc.addTrack(track, streams))
        const offer = await pc.createOffer()
        pc.setLocalDescription(offer)

        const invite: Invite = {
          UUID: localUUID,
          caller: me,
          offer: offer
        }
        stompClient.subscribe(`/topic/calls/${localUUID}`, async (message: IMessage) => {
          switch (message.headers['x-call-event']) {
            case CallEvent.ANSWER:
              {
                const data: Answer = JSON.parse(message.body)
                console.log(`${data.callee.username} accepted the call!`)

                await pc.setRemoteDescription(new RTCSessionDescription(data.answer))
              }
              break
            case CallEvent.ICE_CANDIDATE:
              {
                const data: RTCIceCandidateInit = JSON.parse(message.body)
                console.log('Got remote ICE candidate', data.candidate)
                pc.addIceCandidate(new RTCIceCandidate(data))
                // localICECandidates.push(new RTCIceCandidate(data))
              }
              break
          }
        })
        // const data = JSON.parse(message.body)
        // if (data.type === CallEvent.ANSWER) {
        //   pc.setRemoteDescription(new RTCSessionDescription(data.answer))
        // } else if (data.type === CallEvent.ICE_CANDIDATE) {
        //   pc.addIceCandidate(new RTCIceCandidate(data.candidate))
        // }
        console.log('Sending invite', invite)

        stompClient.send(
          `/user/${username}/${CallEvent.INCOMING_CALL}`,
          { 'x-call-event': CallEvent.INCOMING_CALL },
          JSON.stringify(invite)
        )
      },

      accept: async (invite: Invite) => {
        console.log('Accepting call', invite)
        const remoteUUID = invite.UUID

        const localUUID = crypto.randomUUID()

        const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] })
        pc.onsignalingstatechange = () => {
          console.log('[callee] RTC Signaling state changed to:', pc.signalingState)
        }
        pc.onnegotiationneeded = () => {
          console.log('[callee] RTC Negotiation needed')
        }
        pc.onconnectionstatechange = () => {
          console.log('[callee] RTC Connection state changed to:', pc.connectionState)
        }
        pc.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
          console.log('[callee] Got local ICE candidate', event.candidate)
        }
        stompClient.subscribe(`/topic/calls/${localUUID}`, async (message: IMessage) => {
          console.log('[callee] call signalling message', message.body)
        })

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            stompClient.send(
              `/topic/calls/${remoteUUID}`,
              { 'x-call-event': CallEvent.ICE_CANDIDATE },
              JSON.stringify(event.candidate.toJSON())
            )
          }
        }
        pc.ontrack = (event) => {
          console.log('Got remote track', event)
          const video = document.querySelector('#remote-video') as HTMLVideoElement
          video.srcObject = event.streams[0]
          video.onloadedmetadata = () => {
            video.play()
          }
        }
        pc.setRemoteDescription(new RTCSessionDescription(invite.offer))
        const streams = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        streams.getTracks().forEach((track) => pc.addTrack(track, streams))
        const sdp = await pc.createAnswer()
        pc.setLocalDescription(sdp)
        console.log(`Sending answer for ${remoteUUID}`, sdp)

        const answer: Answer = {
          UUID: localUUID,
          callee: me,
          answer: sdp
        }

        stompClient.send(
          `/topic/calls/${remoteUUID}`,
          { 'x-call-event': CallEvent.ANSWER },
          JSON.stringify(answer)
        )
      }
    }
    resolve(api)
  })
  return promise
}

declare global {
  interface Window {
    callAPI: CallAPI
  }
}
