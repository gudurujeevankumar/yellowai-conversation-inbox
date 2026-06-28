import TopBar from './components/TopBar';
import ListPanel from './components/inbox/ListPanel';
import DetailPanel from './components/detail/DetailPanel';

export default function App() {
  return (
    <div className="h-full flex flex-col">
      <TopBar />
      <div className="flex-1 flex overflow-hidden">
        <ListPanel />
        <DetailPanel />
      </div>
    </div>
  );
}
