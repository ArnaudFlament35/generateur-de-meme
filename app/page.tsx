'use client';

import { useQuery } from '@instantdb/react';
import MemeCard from '@/components/MemeGallery/MemeCard';

export default function HomePage() {
  const { data, isLoading } = useQuery({
    memes: {
      $: {
        order: { created_at: 'desc' },
      },
      user: {},
    },
  });

  const memes = data?.memes || [];

  // Trier par vote_count décroissant
  const sortedMemes = [...memes].sort((a, b) => {
    const votesA = a.vote_count || 0;
    const votesB = b.vote_count || 0;
    return votesB - votesA;
  });

  return (
    <div className="public-gallery">
      <div className="gallery-header">
        <h1 className="gallery-title">Galerie de Memes</h1>
      </div>
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#aaaaaa' }}>
          Chargement...
        </div>
      ) : sortedMemes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#aaaaaa' }}>
          Aucun meme pour le moment. Créez le premier !
        </div>
      ) : (
        <div className="memes-grid">
          {sortedMemes.map((meme) => (
            <MemeCard key={meme.id} meme={meme} />
          ))}
        </div>
      )}
    </div>
  );
}


