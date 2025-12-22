'use client';

import { signOut } from 'next-auth/react';
import { useEffect } from 'react';

export default function SignOutPage() {
  useEffect(() => {
    signOut({ callbackUrl: '/' });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight-950 via-midnight-900 to-midnight-950 flex items-center justify-center">
      <p className="text-muted-foreground">Signing out...</p>
    </div>
  );
}