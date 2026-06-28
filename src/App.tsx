import { useState } from 'react';
import type { Conversation } from './types';
import TopBar from './components/TopBar';
import ListPanel from './components/inbox/ListPanel';
import DetailPanel from './components/detail/DetailPanel';

import QueueStatistics from './components/inbox/QueueStatistics';
import ConversationList from './components/inbox/ConversationList';

export default function App() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  return (
    <div className="h-full flex flex-col">
      <TopBar />
      <div className="flex-1 flex overflow-hidden">
        <ListPanel className={selectedConversation ? 'hidden md:flex' : 'flex'}>
          <QueueStatistics />
          <ConversationList 
            selectedId={selectedConversation?.id}
            onSelect={setSelectedConversation}
          />
        </ListPanel>
        <DetailPanel 
          conversation={selectedConversation} 
          className={selectedConversation ? 'flex' : 'hidden md:flex'}
          onBack={() => setSelectedConversation(null)}
        />
      </div>
    </div>
  );
}
