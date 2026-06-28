import TopBar from './components/TopBar';
import ListPanel from './components/inbox/ListPanel';
import DetailPanel from './components/detail/DetailPanel';

import QueueStatistics from './components/inbox/QueueStatistics';
import ConversationList from './components/inbox/ConversationList';

export default function App() {
  return (
    <div className="h-full flex flex-col">
      <TopBar />
      <div className="flex-1 flex overflow-hidden">
        <ListPanel>
          <QueueStatistics />
          <ConversationList />
        </ListPanel>
        <DetailPanel />
      </div>
    </div>
  );
}
