'use client'

import { signOut } from 'next-auth/react'
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  User
} from '@heroui/react'
import { LogOut, Settings as SettingsIcon, User as UserIcon } from 'lucide-react'

interface UserNavProps {
  user: {
    name?: string | null
    email?: string | null
    role?: string
    image?: string | null
  }
}

export function UserNav({ user }: UserNavProps) {
  return (
    <Dropdown placement="bottom-end" className="dark">
      <DropdownTrigger>
        <div className="cursor-pointer">
          <User
            as="button"
            name={user.name || user.email || 'User'}
            description={user.role ? user.role.charAt(0) + user.role.slice(1).toLowerCase() : 'User'}
            className="transition-transform"
            classNames={{
              name: "text-white",
              description: "text-gray-400 uppercase text-xs font-semibold"
            }}
            avatarProps={{
              size: "sm",
              src: user.image || undefined,
              className: "bg-gradient-to-br from-cyan-500 to-teal-500"
            }}
          />
        </div>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="User menu actions"
        className="dark"
        classNames={{
          base: "bg-gray-800 border border-gray-700",
          list: "gap-0"
        }}
      >
        <DropdownItem
          key="profile"
          className="h-14 gap-2"
          textValue="Profile"
          classNames={{
            base: "data-[hover=true]:bg-gray-700"
          }}
        >
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-white">{user.name || 'Admin User'}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
        </DropdownItem>
        <DropdownItem
          key="account"
          startContent={<UserIcon className="w-4 h-4" />}
          href="/admin/account"
          className="text-gray-300 data-[hover=true]:bg-gray-700 data-[hover=true]:text-white"
        >
          My Account
        </DropdownItem>
        <DropdownItem
          key="settings"
          startContent={<SettingsIcon className="w-4 h-4" />}
          href="/admin/settings"
          className="text-gray-300 data-[hover=true]:bg-gray-700 data-[hover=true]:text-white"
        >
          Settings
        </DropdownItem>
        <DropdownItem
          key="logout"
          color="danger"
          startContent={<LogOut className="w-4 h-4" />}
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="text-red-400 data-[hover=true]:bg-red-900/20 data-[hover=true]:text-red-300"
        >
          Sign Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
