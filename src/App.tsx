import { useState } from 'react';
import type { Conversation } from './types';
import TopBar from './components/TopBar';
import ListPanel from './components/inbox/ListPanel';
import DetailPanel from './components/detail/DetailPanel';

import QueueStatistics from './components/inbox/QueueStatistics';
import ConversationList from './components/inbox/ConversationList';

export default function App() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [statusOverrides, setStatusOverrides] = useState<Record<string, 'waiting' | 'assigned' | 'resolved'>>({});

  const handleAssign = (id: string) => {
    setStatusOverrides(prev => ({ ...prev, [id]: 'assigned' }));
    if (selectedConversation?.id === id) {
      setSelectedConversation({ ...selectedConversation, status: 'assigned' });
    }
  };

  const handleResolve = (id: string) => {
    setStatusOverrides(prev => ({ ...prev, [id]: 'resolved' }));
    if (selectedConversation?.id === id) {
      setSelectedConversation({ ...selectedConversation, status: 'resolved' });
    }
  };

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
        />
      </div>
    </div>
  );
}
