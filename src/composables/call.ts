import { type User } from '@/types'
import { CompatClient } from '@stomp/stompjs'

export type Invite = {
  offer: RTCSessionDescriptionInit
  callUUID: string
  caller: User
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
  accept: (callUUID: string, answer: RTCSessionDescriptionInit) => void
}

const callbacks: Map<string, Function[]> = new Map()

export async function useCall(me: User, stompClient: CompatClient): Promise<CallAPI> {
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

        if (stompClient.connected) {
          stompClient.subscribe(`/user/${me.username}/${event}`, async (message) => {
            callbacks.get(event)?.forEach((callback) => callback(JSON.parse(message.body)))
          })
        }
      },

      call: async (username: string) => {
        if (!stompClient.connected) {
          throw new Error('STOMP communication socket is not connected!')
        }

        const callUUID = crypto.randomUUID()

        // We're sending an invite to the other user

        console.log('Sending invite to', username)

        const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] })
        const offer = await pc.createOffer()

        const invite = {
          callUUID: callUUID,
          caller: me,
          offer: offer
        }
        stompClient.subscribe(`/user/${username}/${callUUID}`, async (message) => {})
        stompClient.send(`/user/${username}/${CallEvent.INCOMING_CALL}`, {}, JSON.stringify(invite))
      },

      accept: async (callUUID: string, answer: RTCSessionDescriptionInit) => {}
    }
    resolve(api)
  })
  return promise
}
