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
  updateUser: (user: User) => Promise<User>
  updateUserImage: (formData: FormData) => Promise<Object>
  // subscribe(pub: Boolean, callback: (message: Message) => void): void
  onConnected: (callback: (message: IMessage) => void) => void
  onPublicMessage: (callback: (message: IMessage) => void) => void
  onDirectMessage: (callback: (message: IMessage) => void) => void
}

export function useAPI(url: string, username: string, token: string): { api: ApiMethods } {
  const urlObj = new URL(url)
  const stompClient = Stomp.client(`ws://${urlObj.host}/ws-native`)
  let connected = false

  const stompCallbacks: Record<string, messageCallbackType> = {}

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
      const convo = await response.json()
      convo.username = username
      return convo
    },

    sendMessage: async (message: MessageRequest) => {
      // If payload has a receiverName, it's a private conversation - route to the private-message endpoint.
      const dest = message?.receiverName ? 'private-message' : 'message'
      console.log('Sending DM to', dest, message)
      stompClient.send(`/app/${dest}`, {}, JSON.stringify(message))
    },

    updateUserImage: async (formData: FormData) => {
      const response = await fetch(`${url}/api/v1/images`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error('Unable to update user image')
      }
      return await response.json()
    },

    updateUser: async (user: User) => {
      const response = await fetch(`${url}/api/v1/users/${user.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(user)
      })

      if (!response.ok) {
        throw new Error('Unable to update user')
      }
      return await response.json()
    },

    onConnected: (callback: (message: IMessage) => void) => {
      if (connected) {
        console.log("Subscribing to '/topic/public'")
        stompClient.subscribe('/topic/public', callback, {})
      } else {
        console.log('Deferring subscription')
        stompCallbacks['/topic/public'] = callback
      }
    },

    onPublicMessage: (callback: (message: IMessage) => void) => {
      if (connected) {
        console.log("Subscribing to '/chatroom/public'")
        stompClient.subscribe('/chatroom/public', callback, {})
        return
      }
      stompCallbacks['/chatroom/public'] = callback
    },

    onDirectMessage: (callback: (message: IMessage) => void) => {
      console.log(`Subscribing to '/user/${username}/private'`)
      if (connected) {
        stompClient.subscribe(`/user/${username}/private`, callback, {})
        return
      }
      stompCallbacks[`/user/${username}/private`] = callback
    }
  }

  stompClient.connect({}, () => {
    connected = true
    Object.entries(stompCallbacks).forEach(([topic, cb]) => {
      console.log(`Subscribing to '${topic}'`)
      stompClient.subscribe(topic, cb, {})
    })
  })

  return { api }
}
