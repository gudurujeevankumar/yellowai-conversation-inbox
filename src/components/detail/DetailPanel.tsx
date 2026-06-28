import type { ReactNode } from 'react';

interface DetailPanelProps {
  children?: ReactNode;
}

export default function DetailPanel({ children }: DetailPanelProps) {
  return (
    <main
      className="flex-1 flex flex-col overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
      aria-label="Conversation details"
    >
      {children ?? <DetailEmptyState />}
    </main>
  );
}

function DetailEmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
        style={{ backgroundColor: 'var(--color-bg-tertiary)' }}
      >
        📥
      </div>
      <p
        className="text-sm font-medium"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        Select a conversation to see details
      </p>
      <p
        className="text-xs"
        style={{ color: 'var(--color-text-tertiary)' }}
      >
        J/K to navigate · Enter to open
      </p>
    </div>
  );
}
