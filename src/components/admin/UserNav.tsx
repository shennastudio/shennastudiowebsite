'use client'

import { signOut } from 'next-auth/react'

interface UserNavProps {
  user: {
    name?: string | null
    email?: string | null
    role?: string
  }
}

export function UserNav({ user }: UserNavProps) {
  return (
    <div className="flex items-center space-x-4">
      <div className="text-sm text-right">
        <p className="font-medium text-gray-900">{user.name || user.email}</p>
        {user.role && (
          <p className="text-xs text-gray-500 uppercase">{user.role}</p>
        )}
      </div>
      <button
        onClick={() => signOut({ callbackUrl: '/admin/login' })}
        className="text-sm text-gray-600 hover:text-gray-900"
      >
        Sign Out
      </button>
    </div>
  )
}
