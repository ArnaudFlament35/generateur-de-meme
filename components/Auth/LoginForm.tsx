'use client';

import { useState } from 'react';
import { db } from '@/lib/instantdb';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await db.auth.signInWithMagicCode({ email, code });
    } catch (err: any) {
      setError(err.body?.message || err.message || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  if (!codeSent) {
    return (
      <form onSubmit={handleSendCode} className="auth-form">
        {error && <div style={{ color: '#ff6666', fontSize: '0.875rem' }}>{error}</div>}
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
    <form onSubmit={handleSignIn} className="auth-form">
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
        <span>{loading ? 'Connexion...' : 'Se connecter'}</span>
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


