import { useEffect, useState } from 'react';
import type { Conversation } from './types';

export default function App() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    fetch('/api/conversations')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data: Conversation[]) => {
        setConversations(data);
        setStatus('success');
      })
      .catch(() => {
        setStatus('error');
      });
  }, []);

  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
          Conversation Inbox
        </h1>
        {status === 'loading' && (
          <p style={{ color: 'var(--color-text-secondary)' }}>Loading conversations…</p>
        )}
        {status === 'error' && (
          <p style={{ color: 'var(--color-action-danger)' }}>Failed to load conversations.</p>
        )}
        {status === 'success' && (
          <p style={{ color: 'var(--color-action-success)' }}>
            ✓ MSW active — {conversations.length} conversations loaded
          </p>
        )}
      </div>
    </div>
  );
}
