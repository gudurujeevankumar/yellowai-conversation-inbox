import { useState, useCallback, useEffect } from 'react';
import type { Conversation } from './types';
import TopBar from './components/TopBar';
import ListPanel from './components/inbox/ListPanel';
import DetailPanel from './components/detail/DetailPanel';

import QueueStatistics from './components/inbox/QueueStatistics';
import ConversationList from './components/inbox/ConversationList';

interface Toast {
  id: string;
  message: string;
}

export default function App() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [statusOverrides, setStatusOverrides] = useState<Record<string, 'waiting' | 'assigned' | 'resolved'>>({});
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const applyTheme = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
    };

    applyTheme(mediaQuery);

    const listener = (e: MediaQueryListEvent) => applyTheme(e);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  const showToast = useCallback((message: string) => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const handleAssign = useCallback((id: string) => {
    setStatusOverrides(prev => ({ ...prev, [id]: 'assigned' }));
    if (selectedConversation?.id === id) {
      setSelectedConversation(prev => prev ? { ...prev, status: 'assigned' } : prev);
    }
    showToast('Conversation assigned');
  }, [selectedConversation?.id, showToast]);

  const handleResolve = useCallback((id: string) => {
    setStatusOverrides(prev => ({ ...prev, [id]: 'resolved' }));
    if (selectedConversation?.id === id) {
      setSelectedConversation(prev => prev ? { ...prev, status: 'resolved' } : prev);
    }
    showToast('Conversation resolved');
  }, [selectedConversation?.id, showToast]);

  return (
    <div className="h-full flex flex-col">
      <TopBar />
      <div className="flex-1 flex overflow-hidden">
        <ListPanel className={selectedConversation ? 'hidden md:flex' : 'flex'}>
          <QueueStatistics statusOverrides={statusOverrides} />
          <ConversationList 
            selectedId={selectedConversation?.id}
            onSelect={setSelectedConversation}
            statusOverrides={statusOverrides}
          />
        </ListPanel>
        <DetailPanel 
          conversation={selectedConversation} 
          className={selectedConversation ? 'flex' : 'hidden md:flex'}
          onBack={() => setSelectedConversation(null)}
          onAssign={handleAssign}
          onResolve={handleResolve}
          onMessageSent={() => showToast('Message sent')}
        />
      </div>

      {/* Toast Notifications */}
      <div className="fixed top-auto bottom-6 md:top-6 md:bottom-auto right-4 md:right-6 flex flex-col gap-2 z-50 pointer-events-none w-full md:w-auto px-4 md:px-0">
        {toasts.map(toast => (
          <div 
            key={toast.id}
            className="animate-toast mx-auto md:mx-0 w-max px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 border pointer-events-auto"
            style={{ 
              backgroundColor: 'var(--color-bg-tertiary)',
              borderColor: 'var(--color-border-default)',
              color: 'var(--color-text-primary)'
            }}
            role="alert"
          >
            <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--color-action-success)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            </div>
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
