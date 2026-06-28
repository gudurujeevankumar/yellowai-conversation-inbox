import { useEffect, useState } from 'react';
import type { Conversation, FetchState } from '../../types';
import ConversationItem from './ConversationItem';

export default function ConversationList() {
  const [state, setState] = useState<FetchState<Conversation[]>>({ status: 'idle' });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchConversations() {
      setState({ status: 'loading' });
      try {
        const response = await fetch('/api/conversations');
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        if (mounted) {
          setState({ status: 'success', data });
        }
      } catch (error) {
        if (mounted) {
          setState({ 
            status: 'error', 
            error: error instanceof Error ? error.message : 'Unknown error' 
          });
        }
      }
    }

    fetchConversations();
    return () => { mounted = false; };
  }, []);

  if (state.status === 'loading' || state.status === 'idle') {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Loading conversations...</p>
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <p className="text-sm" style={{ color: 'var(--color-urgency-critical)' }}>
          {state.error}
        </p>
      </div>
    );
  }

  const conversations = state.data;

  if (conversations.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-center">
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          No active conversations.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pt-3" role="list" aria-label="Conversations">
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          isSelected={selectedId === conversation.id}
          onClick={() => setSelectedId(conversation.id)}
        />
      ))}
    </div>
  );
}
