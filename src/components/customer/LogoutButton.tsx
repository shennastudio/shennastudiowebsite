'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@heroui/react';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  return (
    <Button
      onClick={() => signOut({ callbackUrl: '/login' })}
      variant="bordered"
      startContent={<LogOut className="w-4 h-4" />}
      className="border-white/40 hover:bg-white/20 text-white font-semibold"
    >
      Sign Out
    </Button>
  );
}
