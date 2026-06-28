import { useState, useRef, useEffect, type ReactNode } from 'react';
import type { Conversation, Message } from '../../types';
import MessageComposer from './MessageComposer';

interface DetailPanelProps {
  children?: ReactNode;
  conversation?: Conversation | null;
  className?: string;
  onBack?: () => void;
}

export default function DetailPanel({ children, conversation, className = '', onBack }: DetailPanelProps) {
  if (!conversation) {
    return (
      <main
        className={`flex-1 flex-col overflow-hidden ${className}`}
        style={{ backgroundColor: 'var(--color-bg-primary)' }}
        aria-label="Conversation details"
      >
        {children ?? <DetailEmptyState />}
      </main>
    );
  }

  const { customer, status, urgency, id, messages } = conversation;
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);

  useEffect(() => {
    setLocalMessages([]);
  }, [id]);

  const allMessages = [...messages, ...localMessages];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allMessages]);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: `msg-local-${Date.now()}`,
      role: 'agent',
      content,
      timestamp: new Date().toISOString()
    };
    setLocalMessages(prev => [...prev, newMessage]);
  };
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatFullDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <main
      className={`flex-1 flex-col overflow-hidden relative ${className}`}
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
      aria-label="Conversation details"
    >
      {/* Header */}
      <header 
        className="shrink-0 px-4 md:px-6 py-3 md:py-5 flex flex-col md:flex-row md:items-center justify-between border-b gap-3 md:gap-0"
        style={{ borderColor: 'var(--color-border-default)', backgroundColor: 'var(--color-bg-secondary)' }}
      >
        <div className="flex items-start md:items-center gap-2.5 md:gap-4 w-full">
          
          <div className="flex items-center gap-1.5 shrink-0 h-10 md:h-12">
            {/* Back Button (Mobile only) */}
            <button
              onClick={onBack}
              className="md:hidden w-8 h-8 -ml-1 rounded-lg shrink-0 flex items-center justify-center transition-colors hover:bg-[var(--color-bg-tertiary)]"
              style={{ color: 'var(--color-text-secondary)' }}
              aria-label="Back to conversation list"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
            
            <div 
              className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shrink-0 font-medium text-sm md:text-lg"
              style={{ backgroundColor: 'var(--color-tier-standard-bg)', color: 'var(--color-action-primary)' }}
            >
              {getInitials(customer.name)}
            </div>
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            
            {/* ROW 1: Name + Date (Mobile) / Name (Desktop) */}
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-semibold text-[15px] md:text-lg truncate leading-tight md:leading-normal" style={{ color: 'var(--color-text-primary)' }}>
                {customer.name}
              </h2>
              {/* Mobile Date */}
              <span className="md:hidden text-xs font-medium shrink-0 whitespace-nowrap" style={{ color: 'var(--color-text-primary)' }}>
                {formatFullDate(conversation.waitingSince)}
              </span>
            </div>
            
            {/* ROW 2: ID + Created (Mobile) */}
            <div className="flex items-center justify-between gap-2 mt-0.5 md:hidden">
              <span className="text-[11px] truncate" style={{ color: 'var(--color-text-secondary)' }}>
                ID: {id}
              </span>
              <span className="text-[11px] shrink-0 whitespace-nowrap" style={{ color: 'var(--color-text-tertiary)' }}>
                Created
              </span>
            </div>

            {/* ROW 3: Badges (Mobile) / ID + Badges (Desktop) */}
            <div className="flex items-center gap-2 md:gap-3 mt-1.5 md:mt-1.5 flex-wrap">
              <span className="hidden md:inline text-sm shrink-0" style={{ color: 'var(--color-text-secondary)' }}>
                ID: {id}
              </span>
              <span 
                className="px-2 h-[18px] md:h-[20px] inline-flex items-center rounded-full text-[9px] md:text-[10px] uppercase tracking-wider font-semibold shrink-0"
                style={{ 
                  backgroundColor: status === 'waiting' ? 'var(--color-urgency-high-bg)' : 'var(--color-bg-primary)',
                  color: status === 'waiting' ? 'var(--color-urgency-high)' : 'var(--color-text-secondary)',
                  border: '1px solid',
                  borderColor: status === 'waiting' ? 'transparent' : 'var(--color-border-default)'
                }}
              >
                {status}
              </span>
              <span 
                className="px-2 h-[18px] md:h-[20px] inline-flex items-center rounded-full text-[9px] md:text-[10px] uppercase tracking-wider font-semibold shrink-0"
                style={{ 
                  backgroundColor: urgency === 'critical' ? 'var(--color-urgency-critical-bg)' : urgency === 'high' ? 'var(--color-urgency-high-bg)' : 'var(--color-bg-primary)',
                  color: urgency === 'critical' ? 'var(--color-urgency-critical)' : urgency === 'high' ? 'var(--color-urgency-high)' : 'var(--color-text-secondary)',
                  border: '1px solid',
                  borderColor: urgency === 'critical' || urgency === 'high' ? 'transparent' : 'var(--color-border-default)'
                }}
              >
                {urgency} Priority
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Date Block */}
        <div className="hidden md:block text-right shrink-0">
          <p className="text-sm font-medium whitespace-nowrap" style={{ color: 'var(--color-text-primary)' }}>{formatFullDate(conversation.waitingSince)}</p>
          <p className="text-xs mt-1 whitespace-nowrap" style={{ color: 'var(--color-text-tertiary)' }}>Created</p>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-6" role="log" aria-label="Message history">
        {allMessages.map((message) => {
          const isOutgoing = message.role === 'ai' || message.role === 'agent';
          return (
            <div 
              key={message.id} 
              className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${isOutgoing ? 'self-end items-end' : 'self-start items-start'}`}
            >
              <div 
                className="px-4 py-3 rounded-2xl shadow-sm"
                style={{
                  backgroundColor: isOutgoing ? 'var(--color-action-primary)' : 'var(--color-bg-surface)',
                  color: isOutgoing ? '#FFFFFF' : 'var(--color-text-primary)',
                  borderBottomRightRadius: isOutgoing ? '4px' : '16px',
                  borderBottomLeftRadius: !isOutgoing ? '4px' : '16px',
                  border: isOutgoing ? 'none' : '1px solid var(--color-border-default)'
                }}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
              </div>
              <span className="text-[11px] sm:text-xs mt-1.5 px-1 font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
                {formatTime(message.timestamp)} • {message.role === 'customer' ? customer.name : (message.role === 'ai' ? 'AI Assistant' : 'Agent')}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <MessageComposer onSend={handleSendMessage} />
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
