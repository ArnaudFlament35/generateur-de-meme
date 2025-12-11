'use client';

import { ReactNode } from 'react';

export default function InstantDBProvider({ children }: { children: ReactNode }) {
  // InstantDB n'a pas besoin d'un Provider wrapper dans les versions récentes
  // Les hooks fonctionnent directement avec le contexte global créé par init()
  return <>{children}</>;
}

