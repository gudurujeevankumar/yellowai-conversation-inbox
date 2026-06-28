import { useMemo } from 'react';
import { mockConversations } from '../../mocks/data/conversations';

interface StatCardProps {
  label: string;
  count: number;
  accentColor: string;
}

function StatCard({ label, count, accentColor }: StatCardProps) {
  return (
    <div
      className="p-4 rounded-xl border flex flex-col justify-between gap-3 h-full transition-colors duration-200 cursor-default group"
      style={{
        backgroundColor: 'var(--color-bg-secondary)',
        borderColor: 'var(--color-border-default)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)';
      }}
      role="region"
      aria-label={`${label} statistics`}
    >
      <div className="flex items-start gap-2">
        <div
          className="w-2 h-2 rounded-full shrink-0 mt-1"
          style={{ backgroundColor: accentColor }}
          aria-hidden="true"
        />
        <span
          className="text-xs font-medium uppercase tracking-wider leading-tight break-words"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {label}
        </span>
      </div>
      <div
        className="text-2xl font-bold"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {count}
      </div>
    </div>
  );
}

export default function QueueStatistics() {
  const stats = useMemo(() => {
    let total = 0;
    let open = 0;
    let assigned = 0;
    let resolved = 0;

    mockConversations.forEach((conv) => {
      total++;
      if (conv.status === 'waiting') open++;
      else if (conv.status === 'assigned') assigned++;
      else if (conv.status === 'resolved') resolved++;
    });

    return { total, open, assigned, resolved };
  }, []);

  return (
    <div className="pt-6 pb-6 px-4 sm:px-5 border-b shrink-0" style={{ borderColor: 'var(--color-border-default)' }}>
      <div className="grid grid-cols-2 gap-4 sm:gap-5">
        <StatCard
          label="Total Conversations"
          count={stats.total}
          accentColor="var(--color-brand)"
        />
        <StatCard
          label="Open"
          count={stats.open}
          accentColor="var(--color-urgency-high)"
        />
        <StatCard
          label="Assigned"
          count={stats.assigned}
          accentColor="var(--color-action-primary)"
        />
        <StatCard
          label="Resolved"
          count={stats.resolved}
          accentColor="var(--color-action-success)"
        />
      </div>
    </div>
  );
}
