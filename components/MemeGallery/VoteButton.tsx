'use client';

import { useState } from 'react';
import { useAuth, useQuery } from '@instantdb/react';
import { db, tx, id } from '@/lib/instantdb';

interface VoteButtonProps {
  memeId: string;
  voteCount: number;
}

export default function VoteButton({ memeId, voteCount }: VoteButtonProps) {
  const { user } = useAuth();
  const [isVoting, setIsVoting] = useState(false);

  // Vérifier si l'utilisateur a déjà voté pour ce meme
  const { data } = useQuery({
    votes: {
      $: {
        where: {
          meme_id: memeId,
          user_id: user?.id || '',
        },
      },
    },
  });

  const hasVoted = data?.votes && data.votes.length > 0;

  const handleVote = async () => {
    if (!user) {
      alert('Vous devez être connecté pour voter');
      return;
    }

    if (hasVoted) {
      alert('Vous avez déjà voté pour ce meme');
      return;
    }

    setIsVoting(true);
    try {
      const voteId = id();
      await db.transact([
        tx.votes[voteId].update({
          id: voteId,
          meme_id: memeId,
          user_id: user.id,
          created_at: Date.now(),
        }),
        tx.memes[memeId].update({
          vote_count: voteCount + 1,
        }),
      ]);
    } catch (error) {
      alert('Erreur lors du vote');
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <button
      className="vote-button"
      onClick={handleVote}
      disabled={!user || hasVoted || isVoting}
    >
      <span>↑</span>
      <span className="vote-count">{voteCount}</span>
    </button>
  );
}

