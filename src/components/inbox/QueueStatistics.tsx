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
      className="p-2 px-3 rounded-lg border flex flex-col justify-center transition-colors duration-200 cursor-default group"
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
          className="text-[11px] font-medium truncate"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {label}
        </span>
      </div>
      <div
        className="text-lg font-bold mt-1"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {count}
      </div>
    </div>
  );
}

import type { ConversationStatus } from '../../types';

interface QueueStatisticsProps {
  statusOverrides?: Record<string, ConversationStatus>;
}

export default function QueueStatistics({ statusOverrides = {} }: QueueStatisticsProps) {
  const stats = useMemo(() => {
    let total = 0;
    let open = 0;
    let assigned = 0;
    let resolved = 0;
    let high = 0;
    let medium = 0;
    let low = 0;

    mockConversations.forEach((conv) => {
      total++;
      const status = statusOverrides[conv.id] || conv.status;
      if (status === 'waiting') open++;
      else if (status === 'assigned') assigned++;
      else if (status === 'resolved') resolved++;
      
      if (conv.priority === 'high') high++;
      else if (conv.priority === 'medium') medium++;
      else if (conv.priority === 'low') low++;
    });

    return { total, open, assigned, resolved, high, medium, low };
  }, [statusOverrides]);

  return (
    <div className="pt-3 pb-3 px-4 sm:px-5 border-b shrink-0 flex flex-col" style={{ borderColor: 'var(--color-border-default)' }}>
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <StatCard
          label="Total"
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
