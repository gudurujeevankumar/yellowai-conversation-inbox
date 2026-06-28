import { useState, useRef, type KeyboardEvent, type ChangeEvent } from 'react';

interface MessageComposerProps {
  onSend: (content: string) => void;
}

export default function MessageComposer({ onSend }: MessageComposerProps) {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (content.trim()) {
      onSend(content.trim());
      setContent('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'; // Reset height
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    
    // Auto-grow logic
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      // approx 5 lines is ~100px-120px depending on line height. 
      // max-height can be handled via CSS className "max-h-[120px]"
      textareaRef.current.style.height = `${scrollHeight}px`;
    }
  };

  return (
    <div 
      className="shrink-0 p-4 border-t bg-[var(--color-bg-primary)] w-full"
      style={{ borderColor: 'var(--color-border-default)' }}
    >
      <div 
        className="flex items-end gap-2 bg-[var(--color-bg-secondary)] border rounded-2xl p-2 transition-colors focus-within:border-[var(--color-action-primary)]"
        style={{ borderColor: 'var(--color-border-default)' }}
      >
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 bg-transparent resize-none outline-none py-2 px-3 text-sm max-h-[120px] overflow-y-auto"
          style={{ color: 'var(--color-text-primary)', minHeight: '40px' }}
          rows={1}
          aria-label="Message text"
        />
        <button
          onClick={handleSend}
          disabled={!content.trim()}
          className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ 
            backgroundColor: content.trim() ? 'var(--color-action-primary)' : 'var(--color-bg-tertiary)',
            color: content.trim() ? '#fff' : 'var(--color-text-tertiary)'
          }}
          aria-label="Send message"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m22 2-7 20-4-9-9-4Z"/>
            <path d="M22 2 11 13"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
