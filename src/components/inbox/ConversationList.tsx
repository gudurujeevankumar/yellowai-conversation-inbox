import { useEffect, useState, useMemo, useRef } from 'react';
import type { Conversation, FetchState, ConversationStatus } from '../../types';
import ConversationItem from './ConversationItem';

interface ConversationListProps {
  selectedId?: string;
  onSelect?: (conversation: Conversation) => void;
  statusOverrides?: Record<string, ConversationStatus>;
}

type FilterType = 'all' | 'open' | 'assigned' | 'resolved';

export default function ConversationList({ selectedId, onSelect, statusOverrides = {} }: ConversationListProps) {
  const [state, setState] = useState<FetchState<Conversation[]>>({ status: 'idle' });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  const filteredConversations = useMemo(() => {
    if (state.status !== 'success') return [];
    
    return state.data.filter(conv => {
      const actualStatus = statusOverrides[conv.id] || conv.status;

      // Status Filter
      if (activeFilter === 'open' && actualStatus !== 'waiting') return false;
      if (activeFilter === 'assigned' && actualStatus !== 'assigned') return false;
      if (activeFilter === 'resolved' && actualStatus !== 'resolved') return false;

      // Search Filter
      if (!searchQuery.trim()) return true;
      
      const query = searchQuery.toLowerCase();
      const matchName = conv.customer.name.toLowerCase().includes(query);
      const matchId = conv.id.toLowerCase().includes(query);
      
      const lastMessage = conv.messages[conv.messages.length - 1];
      const matchMessage = lastMessage ? lastMessage.content.toLowerCase().includes(query) : false;

      return matchName || matchId || matchMessage;
    });
  }, [state, searchQuery, activeFilter, statusOverrides]);

  if (state.status === 'loading' || state.status === 'idle') {
    return (
      <div className="flex-1 flex flex-col pt-3 overflow-hidden" aria-busy="true" aria-label="Loading conversations">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="px-4 sm:px-5 py-5 border-b border-[var(--color-border-default)] animate-pulse flex gap-3">
            <div className="w-10 h-10 rounded-full shrink-0" style={{ backgroundColor: 'var(--color-bg-tertiary)' }} />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <div className="h-4 w-24 rounded" style={{ backgroundColor: 'var(--color-bg-tertiary)' }} />
                <div className="h-3 w-10 rounded" style={{ backgroundColor: 'var(--color-bg-tertiary)' }} />
              </div>
              <div className="h-3 w-3/4 rounded mt-2" style={{ backgroundColor: 'var(--color-bg-tertiary)' }} />
            </div>
          </div>
        ))}
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

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Search & Filters */}
      <div className="shrink-0 px-4 sm:px-5 py-4 border-b" style={{ borderColor: 'var(--color-border-default)' }}>
        <div 
          className="flex items-center gap-2 px-3 py-2 rounded-xl border transition-colors focus-within:border-[var(--color-action-primary)]"
          style={{ borderColor: 'var(--color-border-default)', backgroundColor: 'var(--color-bg-primary)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-text-tertiary)' }}>
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          <input 
            ref={searchInputRef}
            type="text" 
            placeholder="Search conversations... (Press '/')" 
            className="flex-1 bg-transparent outline-none text-sm min-w-0"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ color: 'var(--color-text-primary)' }}
            aria-label="Search conversations"
            title="Press '/' to search"
          />
        </div>
        
        <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide" role="radiogroup" aria-label="Filter conversations by status">
          {(['all', 'open', 'assigned', 'resolved'] as const).map(filter => (
            <button
              key={filter}
              role="radio"
              aria-checked={activeFilter === filter}
              onClick={() => setActiveFilter(filter)}
              className="px-3 py-1.5 rounded-full text-xs font-medium capitalize whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--color-action-primary)] focus-visible:outline-none hover:opacity-90"
              style={{
                backgroundColor: activeFilter === filter ? 'var(--color-action-primary)' : 'var(--color-bg-tertiary)',
                color: activeFilter === filter ? '#FFFFFF' : 'var(--color-text-secondary)',
              }}
              title={`Filter by ${filter}`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto pt-2" role="list" aria-label="Conversations">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center gap-3">
             <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: 'var(--color-bg-tertiary)' }}>
               🔍
             </div>
             <div>
               <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>No conversations found</p>
               <p className="text-xs mt-1" style={{ color: 'var(--color-text-tertiary)' }}>Try changing your search or filters.</p>
             </div>
          </div>
        ) : (
          filteredConversations.map((conversation) => {
            const actualStatus = statusOverrides[conversation.id] || conversation.status;
            return (
              <ConversationItem
                key={conversation.id}
                conversation={{ ...conversation, status: actualStatus }}
                isSelected={selectedId === conversation.id}
                onClick={() => onSelect?.({ ...conversation, status: actualStatus })}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
