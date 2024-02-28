import { createContext } from 'react'

export interface CurrentUser {
  userId: string
  name: string
  isAdmin: boolean
}

export const initialUser: CurrentUser = {
  userId: '',
  name: '',
  isAdmin: false,
}

export const AuthContext = createContext<CurrentUser>(initialUser)
