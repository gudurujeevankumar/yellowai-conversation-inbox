import type { ReactNode } from 'react';

interface ListPanelProps {
  children?: ReactNode;
}

export default function ListPanel({ children }: ListPanelProps) {
  return (
    <aside
      className="w-[380px] shrink-0 flex flex-col overflow-y-auto border-r"
      style={{
        backgroundColor: 'var(--color-bg-secondary)',
        borderColor: 'var(--color-border-default)',
      }}
      aria-label="Conversation queue"
    >
      {children}
    </aside>
  );
}
