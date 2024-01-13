import type { Conversation, Message, MessageRequest, User } from '@/types'
import { Stomp, type IMessage, type messageCallbackType } from '@stomp/stompjs'

export interface ApiMethods {
  // Define the methods you want to expose for API calls
  getUsers: () => Promise<User[]>
  getMessages: (convId: number) => Promise<Message[]>
  getConversation: (username: String) => Promise<Conversation>
  getDirectMessages: () => Promise<User[]>
  getPublicChats: () => Promise<Conversation[]>
  createConversation: (username: String) => Promise<Conversation>
  sendMessage(message: MessageRequest): void
  // subscribe(pub: Boolean, callback: (message: Message) => void): void
  onConnected: (callback: (message: IMessage) => void) => void
}

export function useAPI(url: string, token: string): { api: ApiMethods } {
  const urlObj = new URL(url)
  const stompClient = Stomp.client(`ws://${urlObj.host}/ws-native`)
  let connected = false

  const stompCallbacks: messageCallbackType[] = []

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  }

  const api = {
    getUsers: async () => {
      const response = await fetch(`${url}/api/v1/users`, {
        headers
      })

      if (!response.ok) {
        throw new Error('Unable to fetch users')
      }
      const data = await response.json()
      return data?.content
    },

    getMessages: async (convId: number) => {
      const response = await fetch(`${url}/api/v1/conversations/${convId}/messages`, {
        headers
      })

      if (!response.ok) {
        throw new Error('Unable to fetch users')
      }
      return await response.json()
    },

    getDirectMessages: async () => {
      const response = await fetch(`${url}/api/v1/conversations/messaged-participants`, {
        headers
      })

      if (!response.ok) {
        throw new Error('Unable to fetch direct messages')
      }
      return await response.json()
    },

    getPublicChats: async () => {
      const response = await fetch(`${url}/api/v1/conversations/public`, {
        headers
      })

      if (!response.ok) {
        throw new Error('Unable to fetch public chats')
      }
      return await response.json()
    },

    getConversation: async (username: String) => {
      const response = await fetch(
        `${url}/api/v1/conversations/participants/${username}/messages`,
        {
          headers
        }
      )

      if (!response.ok) {
        throw new Error('Unable to fetch conversations')
      }
      return await response.json()
    },

    createConversation: async (username: String) => {
      const response = await fetch(`${url}/api/v1/conversations`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ participants: [username] })
      })

      if (!response.ok) {
        throw new Error(`Unable to create conversation with ${username}`)
      }
      return await response.json()
    },

    sendMessage: async (message: MessageRequest) => {
      // If payload has a receiverName, it's a private conversation - route to the private-message endpoint.
      const dest = message?.receiverName ? 'private-message' : 'message'
      stompClient.send(`/app/${dest}`, {}, JSON.stringify(message))
    },

    onConnected: (callback: (message: IMessage) => void) => {
      if (connected) {
        console.log("Subscribing to '/topic/public'")
        stompClient.subscribe('/topic/public', callback, {})
      } else {
        console.log('Deferring subscription')
        stompCallbacks.push(callback)
      }
    }
  }

  stompClient.connect({}, () => {
    connected = true
    stompCallbacks.forEach((cb) => {
      console.log("Subscribing to '/topic/public'")
      stompClient.subscribe('/topic/public', cb, {})
    })
  })

  return { api }
}
