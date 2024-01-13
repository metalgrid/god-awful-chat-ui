enum Role {
  ROLE_USER = 'ROLE_USER',
  ROLE_ADMIN = 'ROLE_ADMIN'
}

type Authority = {
  authority: Role
}

interface LoginRequest {
  username: string
  password: string
}

interface RegistrationRequest {
  username: string
  password: string
  fullName: string
}

interface User {
  id: number
  username: string
  fullName: string
  status: 'online' | 'dnd' | 'away' | 'offline'
  profileImage: string
}

interface Auth {
  token: string
  user: User
  authorities: Authority[]
}

interface Message {
  conversationId: number
  id: number
  message: string
  timeStamp: string
  user: User
}

interface Conversation {
  id: number
  public: boolean
  exists: boolean
  username: string
  messages: Message[]
}

interface MessageRequest {
  conversationId: number
  message: string
  senderName: string
  receiverName: string | null
}

export type {
  Role,
  Authority,
  User,
  Auth,
  Message,
  Conversation,
  MessageRequest,
  LoginRequest,
  RegistrationRequest
}
