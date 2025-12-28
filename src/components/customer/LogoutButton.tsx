'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  return (
    <Button
      onClick={() => signOut({ callbackUrl: '/login' })}
      variant="outline"
      className="border-white/40 hover:bg-white/20 text-white font-semibold"
    >
      <LogOut className="w-4 h-4 mr-2" />
      Sign Out
    </Button>
  );
}
