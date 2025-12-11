import { init, id, tx } from '@instantdb/react';

const APP_ID = process.env.NEXT_PUBLIC_INSTANTDB_APP_ID || '8df3dccd-a945-4d8f-8ace-161a00ae419b';

// Exporter id et tx pour faciliter leur utilisation
export { id, tx };

// Définition du schéma de base de données
const schema = {
  users: {
    id: { type: 'id' },
    email: { type: 'string' },
    username: { type: 'string' },
    created_at: { type: 'number' },
  },
  memes: {
    id: { type: 'id' },
    user_id: { type: 'id' },
    image_base64: { type: 'string' },
    title: { type: 'string', optional: true },
    created_at: { type: 'number' },
    vote_count: { type: 'number', default: 0 },
  },
  votes: {
    id: { type: 'id' },
    meme_id: { type: 'id' },
    user_id: { type: 'id' },
    created_at: { type: 'number' },
  },
} as const;

// Relations
const relationships = {
  memes: {
    user: { type: 'belongs_to', to: 'users', as: 'user' },
    votes: { type: 'has_many', to: 'votes', as: 'votes' },
  },
  votes: {
    meme: { type: 'belongs_to', to: 'memes', as: 'meme' },
    user: { type: 'belongs_to', to: 'users', as: 'user' },
  },
  users: {
    memes: { type: 'has_many', to: 'memes', as: 'memes' },
    votes: { type: 'has_many', to: 'votes', as: 'votes' },
  },
} as const;

// Initialiser InstantDB
export const db = init({
  appId: APP_ID,
  schema,
  relationships,
});

// Types TypeScript pour le schéma
export type Schema = typeof schema;
export type User = {
  id: string;
  email: string;
  username: string;
  created_at: number;
};

export type Meme = {
  id: string;
  user_id: string;
  image_base64: string;
  title?: string;
  created_at: number;
  vote_count: number;
};

export type Vote = {
  id: string;
  meme_id: string;
  user_id: string;
  created_at: number;
};

