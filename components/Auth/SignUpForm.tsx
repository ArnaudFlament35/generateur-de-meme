'use client';

import { useState, useEffect } from 'react';
import { db, tx } from '@/lib/instantdb';
import { useAuth, useQuery } from '@instantdb/react';

export default function SignUpForm() {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Vérifier si l'utilisateur existe déjà dans la table users
  const { data } = useQuery({
    users: {
      $: {
        where: { id: user?.id || '' },
      },
    },
  });

  // Mettre à jour le username après connexion
  useEffect(() => {
    if (user && data?.users && data.users.length === 0 && username) {
      // Créer l'utilisateur dans la table users
      db.transact(
        tx.users[user.id].update({
          id: user.id,
          email: user.email || email,
          username,
          created_at: Date.now(),
        })
      ).catch(console.error);
    } else if (user && data?.users && data.users.length > 0 && username && !data.users[0].username) {
      // Mettre à jour le username si l'utilisateur existe mais n'a pas de username
      db.transact(
        tx.users[user.id].update({ username })
      ).catch(console.error);
    }
  }, [user, data, username, email]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await db.auth.sendMagicCode({ email });
      setCodeSent(true);
    } catch (err: any) {
      setError(err.body?.message || err.message || 'Erreur lors de l\'envoi du code');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await db.auth.signInWithMagicCode({ email, code });
      // L'utilisateur sera créé automatiquement par InstantDB auth
      // Le useEffect s'occupera de créer/mettre à jour l'entrée dans la table users
    } catch (err: any) {
      setError(err.body?.message || err.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  if (!codeSent) {
    return (
      <form onSubmit={handleSendCode} className="auth-form">
        {error && <div style={{ color: '#ff6666', fontSize: '0.875rem' }}>{error}</div>}
        <div className="form-group">
          <label className="form-label">Nom d'utilisateur</label>
          <input
            type="text"
            className="form-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="action-button" disabled={loading}>
          <span>{loading ? 'Envoi...' : 'Envoyer le code'}</span>
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSignUp} className="auth-form">
      {error && <div style={{ color: '#ff6666', fontSize: '0.875rem' }}>{error}</div>}
      <div className="form-group">
        <label className="form-label">Code reçu par email</label>
        <input
          type="text"
          className="form-input"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="123456"
          required
        />
      </div>
      <button type="submit" className="action-button" disabled={loading}>
        <span>{loading ? 'Inscription...' : 'S\'inscrire'}</span>
      </button>
      <button
        type="button"
        onClick={() => {
          setCodeSent(false);
          setCode('');
        }}
        className="action-button"
        style={{ marginTop: '10px', background: 'var(--bg-tertiary)' }}
      >
        <span>Changer d'email</span>
      </button>
    </form>
  );
}


