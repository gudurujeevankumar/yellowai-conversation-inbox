import type { ReactNode } from 'react';

interface ListPanelProps {
  children?: ReactNode;
  className?: string;
}

export default function ListPanel({ children, className = '' }: ListPanelProps) {
  return (
    <aside
      className={`w-full md:w-[380px] shrink-0 flex-col overflow-y-auto border-r ${className}`}
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
