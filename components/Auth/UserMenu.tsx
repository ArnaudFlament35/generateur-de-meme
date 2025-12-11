'use client';

import { useAuth, useQuery } from '@instantdb/react';
import { db } from '@/lib/instantdb';
import Link from 'next/link';

export default function UserMenu() {
  const { user, signOut } = useAuth();
  const { data } = useQuery({
    users: {
      $: {
        where: { id: user?.id },
      },
    },
  });

  const currentUser = data?.users?.[0];

  if (!user) {
    return (
      <div className="user-menu">
        <Link href="/login" className="nav-link">
          Se connecter
        </Link>
      </div>
    );
  }

  const handleSignOut = async () => {
    try {
      await db.auth.signOut();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <div className="user-menu">
      <span className="user-name">{currentUser?.username || user.email}</span>
      <button
        onClick={handleSignOut}
        className="nav-link"
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
      >
        Déconnexion
      </button>
    </div>
  );
}

