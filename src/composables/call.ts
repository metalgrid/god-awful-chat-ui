import { type User } from '@/types'
import { CompatClient } from '@stomp/stompjs'
import { inject, unref } from 'vue'

type Invite = {
  offer: RTCSessionDescriptionInit
  callUUID: string
  caller: User
}

enum CallEvent {
  INVITE = 'invite',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  HANGUP = 'hangup',
  ICE_CANDIDATE = 'ice-candidate',
  OFFER = 'offer',
  ANSWER = 'answer'
}

const callbacks: Map<string, Function[]> = new Map()

export function useCall(me: User, stompClient: CompatClient) {
  if (!stompClient) {
    throw new Error('STOMP communication socket is not provided!')
  }

  // Start listening for calls
  stompClient.subscribe(`/user/${me.username}/calls`, async (message) => {
    const data: Invite = JSON.parse(message.body)
    console.log('Received invite', data)
  })

  return {
    on: (event: CallEvent, callback: Function) => {
      if (!Object.values(CallEvent).includes(event)) {
        throw new Error(`Unknown event: ${event}`)
      }

      if (!callbacks.has(event)) {
        callbacks.set(event, [])
      }

      callbacks.get(event)?.push(callback)
    },

    call: async (username: string) => {
      if (!stompClient.connected) {
        throw new Error('STOMP communication socket is not connected!')
      }

      const callUUID = crypto.randomUUID()

      // We're sending an invite to the other user

      const invite = {
        callUUID: callUUID,
        caller: me
      }

      stompClient.send(`/user/${username}/calls`, {}, JSON.stringify(invite))
    }
  }
}
