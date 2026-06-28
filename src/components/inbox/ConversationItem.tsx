import type { Conversation } from '../../types';

interface ConversationItemProps {
  conversation: Conversation;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function ConversationItem({ conversation, isSelected = false, onClick }: ConversationItemProps) {
  const { customer, messages, status, waitingSince } = conversation;
  
  // Use the last message for the preview
  const lastMessage = messages[messages.length - 1];
  
  // Format the timestamp (HH:MM or short date)
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div
      role="listitem"
      aria-selected={isSelected}
      onClick={onClick}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={`px-4 sm:px-5 py-5 border-b border-l-2 cursor-pointer transition-all duration-200 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-action-primary)] focus-visible:outline-none
        ${isSelected ? 'bg-[var(--color-bg-tertiary)] border-[var(--color-action-primary)]' : 'border-l-transparent hover:bg-[var(--color-bg-tertiary)] hover:pl-5 sm:hover:pl-6'}
      `}
      style={{ borderColor: 'var(--color-border-default)' }}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-medium text-sm"
          style={{ backgroundColor: 'var(--color-tier-standard-bg)', color: 'var(--color-action-primary)' }}
        >
          {getInitials(customer.name)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-semibold text-sm truncate pr-2" style={{ color: 'var(--color-text-primary)' }}>
              {customer.name}
            </h3>
            <span className="text-xs shrink-0" style={{ color: 'var(--color-text-tertiary)' }}>
              {formatTime(lastMessage?.timestamp || waitingSince)}
            </span>
          </div>

          <div className="flex justify-between items-center gap-4">
            <p className="text-xs truncate" style={{ color: 'var(--color-text-secondary)' }}>
              {lastMessage?.content || conversation.subject}
            </p>
            {status === 'waiting' && (
              <div 
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: 'var(--color-urgency-high)' }}
                aria-label="Unread"
              />
            )}
          </div>
          
          {/* Status Badge */}
          <div className="mt-2 flex">
            <span 
              className="text-[10px] uppercase tracking-wider font-semibold px-2 h-[18px] inline-flex items-center rounded-full"
              style={{ 
                backgroundColor: status === 'waiting' ? 'var(--color-urgency-high-bg)' : 'var(--color-bg-primary)',
                color: status === 'waiting' ? 'var(--color-urgency-high)' : 'var(--color-text-secondary)',
                border: '1px solid',
                borderColor: status === 'waiting' ? 'transparent' : 'var(--color-border-default)'
              }}
            >
              {status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
