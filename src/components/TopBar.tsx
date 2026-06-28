export default function TopBar() {
  return (
    <header
      className="h-[52px] shrink-0 flex items-center justify-between px-5 border-b"
      style={{
        backgroundColor: 'var(--color-bg-secondary)',
        borderColor: 'var(--color-border-default)',
      }}
      role="banner"
    >
      <div className="flex items-center gap-3">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: 'var(--color-brand)' }}
        />
        <span
          className="text-sm font-semibold"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Inbox
        </span>
      </div>

      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium"
        style={{
          backgroundColor: 'var(--color-action-primary)',
          color: '#fff',
        }}
        aria-label="Agent avatar"
      >
        PS
      </div>
    </header>
  );
}
