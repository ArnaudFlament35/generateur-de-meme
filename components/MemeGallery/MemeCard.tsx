'use client';

import Image from 'next/image';
import VoteButton from './VoteButton';
import { Meme } from '@/lib/instantdb';

interface MemeCardProps {
  meme: Meme & {
    user?: {
      username?: string;
      email?: string;
    };
  };
}

export default function MemeCard({ meme }: MemeCardProps) {
  return (
    <div className="meme-card">
      <div className="meme-image-wrapper">
        <img
          src={meme.image_base64}
          alt={meme.title || 'Meme'}
          className="meme-image"
        />
      </div>
      <div className="meme-footer">
        <div className="meme-info">
          {meme.title && (
            <div className="meme-title">{meme.title}</div>
          )}
          <div className="meme-author">
            Par {meme.user?.username || meme.user?.email || 'Anonyme'}
          </div>
        </div>
        <VoteButton memeId={meme.id} voteCount={meme.vote_count || 0} />
      </div>
    </div>
  );
}


