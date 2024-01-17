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

type CallEventProps = {}

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
  internal: (event: CallEvent, callback: Function) => void
  call: (username: string) => void
  accept: (invite: Invite) => Promise<void>
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
      internal: (event: CallEvent, callback: Function) => {},
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

        const localICECandidates: RTCIceCandidate[] = []
        const localUUID = crypto.randomUUID()
        let remoteUUID = ''
        console.log('Initiating Call UUID', localUUID, 'to', username)

        const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] })
        pc.onsignalingstatechange = () => {
          const sendICE = (event: RTCPeerConnectionIceEvent) => {
            if (event.candidate) {
              stompClient.send(
                `/topic/calls/${remoteUUID}`,
                { 'x-call-event': CallEvent.ICE_CANDIDATE },
                JSON.stringify(event.candidate.toJSON())
              )
            }
          }
          if (pc.signalingState === 'stable') {
            if (!remoteUUID) {
              throw new Error('Remote UUID is not set, bur Peer connection is stable???')
            }
            console.log('[caller] Sending ICE candidates', localICECandidates)
            localICECandidates.forEach((candidate) => {
              stompClient.send(
                `/topic/calls/${remoteUUID}`,
                { 'x-call-event': CallEvent.ICE_CANDIDATE },
                JSON.stringify(candidate.toJSON())
              )
            })
            // register a handler for future ICE candidates
            pc.onicecandidate = sendICE
          }
          // exchange ICE candidates
          console.log('[caller] RTC Signaling state changed to:', pc.signalingState)
        }
        pc.onnegotiationneeded = () => {
          console.log('[caller] RTC Negotiation needed')
        }
        pc.onconnectionstatechange = () => {
          console.log('[caller] RTC Connection state changed to:', pc.connectionState)
        }

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            localICECandidates.push(event.candidate)
          }
          // the caller may get their ICE candidates before the callee is ready to receive them, so store and ship on stable state
        }

        pc.ontrack = (event: RTCTrackEvent) => {
          console.log('Got remote track', event)
          const video = document.querySelector('#remote-video') as HTMLVideoElement
          video.srcObject = event.streams[0]
          video.onloadedmetadata = () => {
            video.play()
          }
        }

        const streams = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        streams.getTracks().forEach((track) => {
          if (track.kind === 'video') {
            const localVideo = document.querySelector('#local-video') as HTMLVideoElement
            if (localVideo) localVideo.srcObject = streams
          }
          pc.addTrack(track, streams)
        })
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
                remoteUUID = data.UUID

                await pc.setRemoteDescription(new RTCSessionDescription(data.answer))
              }
              break
            case CallEvent.ICE_CANDIDATE:
              {
                const data: RTCIceCandidateInit = JSON.parse(message.body)
                pc.addIceCandidate(new RTCIceCandidate(data))
              }
              break
          }
        })
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
        stompClient.subscribe(`/topic/calls/${localUUID}`, async (message: IMessage) => {
          switch (message.headers['x-call-event']) {
            case CallEvent.ANSWER:
              {
                throw new Error('Unexpected ANSWER event')
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

        pc.onicecandidate = (event) => {
          // immediately send as we're receiving the call, so the caller is already waiting for our ICE candidates
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
        streams.getTracks().forEach((track) => {
          if (track.kind === 'video') {
            const localVideo = document.querySelector('#local-video') as HTMLVideoElement
            if (localVideo) localVideo.srcObject = streams
          }
          pc.addTrack(track, streams)
        })
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
