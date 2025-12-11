'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/Auth/LoginForm';
import SignUpForm from '@/components/Auth/SignUpForm';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">
            {isSignUp ? 'Créer un compte' : 'Se connecter'}
          </h1>
          <p className="auth-subtitle">
            {isSignUp
              ? 'Rejoignez la communauté de memes'
              : 'Accédez à votre compte'}
          </p>
        </div>
        {isSignUp ? <SignUpForm /> : <LoginForm />}
        <div className="auth-footer">
          {isSignUp ? (
            <>
              Déjà un compte ?{' '}
              <button
                className="auth-link"
                onClick={() => setIsSignUp(false)}
              >
                Se connecter
              </button>
            </>
          ) : (
            <>
              Pas encore de compte ?{' '}
              <button
                className="auth-link"
                onClick={() => setIsSignUp(true)}
              >
                S'inscrire
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


