import React, { useState } from 'react';
import { SupabaseAuthService } from '../services/auth';
import { Page } from '../App';

interface PasswordResetPageProps {
    onNavigate: (page: Page) => void;
}

export function PasswordResetPage({ onNavigate }: PasswordResetPageProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const authService = new SupabaseAuthService();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      await authService.resetPassword(email);
      setMessage('Password reset email sent. Please check your inbox.');
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>Reset Password</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <button type="submit">Send Reset Link</button>
      </form>
      {error && <p>{error}</p>}
      {message && <p>{message}</p>}
      <button onClick={() => onNavigate('login')}>Back to Login</button>
    </div>
  );
}