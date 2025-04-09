// Extend the `next-auth/jwt` module to include `role`
import 'next-auth/jwt'
import { DefaultSession } from 'next-auth'

declare module 'next-auth/jwt' {
  interface JWT {
    role: string
    id: string
    status: string
  }
}

// Extend the `next-auth` module to include `role` in `Session` and `User`
declare module 'next-auth' {
  interface Session {
    user: {
      role: string
      id: string
      status: string
    } & DefaultSession['user']
  }

  interface User {
    role: string
    id: string
    status: string
  }
}
