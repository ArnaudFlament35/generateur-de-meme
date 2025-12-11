'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import UserMenu from '@/components/Auth/UserMenu';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="nav-header">
      <div className="nav-container">
        <div className="nav-links">
          <Link
            href="/"
            className={`nav-link ${pathname === '/' ? 'active' : ''}`}
          >
            Galerie
          </Link>
          <Link
            href="/create"
            className={`nav-link ${pathname === '/create' ? 'active' : ''}`}
          >
            Créer un meme
          </Link>
        </div>
        <UserMenu />
      </div>
    </header>
  );
}


