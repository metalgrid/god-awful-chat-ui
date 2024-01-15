import type { Conversation, MessageRequest, User, UserStatusRequest } from '@/types'
import { Stomp, type IMessage, type messageCallbackType, CompatClient } from '@stomp/stompjs'

export interface ApiMethods {
  // Define the methods you want to expose for API calls
  getUsers: () => Promise<User[]>
  getConversationById: (convId: number) => Promise<Conversation>
  getConversation: (username: String) => Promise<Conversation>
  getDirectMessages: () => Promise<User[]>
  getPublicChats: () => Promise<Conversation[]>
  createConversation: (username: String) => Promise<Conversation>
  sendMessage(message: MessageRequest): void
  updateUser: (user: User) => Promise<User>
  updateUserImage: (formData: FormData) => Promise<Object>
  updateUserStatus: (status: UserStatusRequest) => void
  onConnected: (callback: (message: IMessage) => void) => void
  onPublicMessage: (callback: (message: IMessage) => void) => void
  onDirectMessage: (callback: (message: IMessage) => void) => void
  sendServiceMessage: (message: IMessage, headers: Record<string, any>) => void
}

declare global {
  export interface Window {
    api: ApiMethods
    sc: CompatClient
  }
}

export function useAPI(
  url: string,
  username: string,
  token: string
): { api: ApiMethods; stompClient: CompatClient } {
  let urlObj: URL
  try {
    urlObj = new URL(url)
  } catch (e: any) {
    urlObj = new URL(window.location.href)
  }

  const stompClient = Stomp.client(`ws://${urlObj.host}/ws-native`)
  // stompClient.debug = () => {}
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

    getConversationById: async (convId: number): Promise<Conversation> => {
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
        stompClient.subscribe('/topic/public', callback, {})
        return
      }
      stompCallbacks['/topic/public'] = callback
    },

    onPublicMessage: (callback: (message: IMessage) => void) => {
      if (connected) {
        stompClient.subscribe('/chatroom/public', callback, {})
        return
      }
      stompCallbacks['/chatroom/public'] = callback
    },

    onDirectMessage: (callback: (message: IMessage) => void) => {
      if (connected) {
        stompClient.subscribe(`/user/${username}/private`, callback, {})
        return
      }
      stompCallbacks[`/user/${username}/private`] = callback
    },

    updateUserStatus: (status: UserStatusRequest) => {
      stompClient.send(`/topic/public`, {}, JSON.stringify({ status }))
    },

    sendServiceMessage: (message: IMessage, headers: Record<string, any>) => {
      stompClient.send(`/topic/public`, headers, JSON.stringify(message))
    }
  }

  stompClient.connect({}, () => {
    connected = true
    Object.entries(stompCallbacks).forEach(([topic, cb]) => {
      stompClient.subscribe(topic, cb, {})
    })
  })

  window.api = api
  window.sc = stompClient

  return { api, stompClient }
}
