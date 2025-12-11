'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@instantdb/react';
import { db, tx, id } from '@/lib/instantdb';
import MemeGenerator from '@/components/MemeGenerator';

export default function CreatePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [publishing, setPublishing] = useState(false);

  const handlePublish = async (imageBase64: string) => {
    if (!user) {
      router.push('/login');
      return;
    }

    setPublishing(true);
    try {
      const memeId = id();
      await db.transact(
        tx.memes[memeId].update({
          id: memeId,
          user_id: user.id,
          image_base64: imageBase64,
          title: `Meme ${new Date().toLocaleDateString()}`,
          created_at: Date.now(),
          vote_count: 0,
        })
      );
      router.push('/');
    } catch (error) {
      alert('Erreur lors de la publication');
    } finally {
      setPublishing(false);
    }
  };

  return <MemeGenerator onPublish={handlePublish} />;
}

