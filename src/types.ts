enum Role {
  ROLE_USER = 'ROLE_USER',
  ROLE_ADMIN = 'ROLE_ADMIN'
}

type Authority = {
  authority: Role
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

export type { Role, Authority, User, Auth, Message, Conversation }