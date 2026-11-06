import { useState, useRef, useEffect, type ReactNode } from 'react';
import { TERMS, type TermDefinition } from '../../data/terms';

interface TermProps {
  id: string;
  children?: ReactNode;
}

export default function Term({ id, children }: TermProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const termData: TermDefinition | undefined = TERMS[id.toLowerCase()];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!termData) {
    return <span>{children || id}</span>;
  }

  return (
    <span className="term-wrapper">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        className="term-trigger"
        aria-expanded={isOpen}
      >
        <span>{children || termData.name}</span>
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </button>

      {isOpen && (
        <div
          ref={popoverRef}
          onMouseLeave={() => setIsOpen(false)}
          className="term-popover"
          role="dialog"
          aria-label={termData.name}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              paddingBottom: '6px',
              marginBottom: '8px',
              borderBottom: '1px solid var(--color-border-subtle)',
            }}
          >
            <strong style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-main)' }}>
              {termData.name}
            </strong>
            <span className="status-pill status-pill--info">{termData.category}</span>
          </div>

          <p
            style={{
              margin: '0 0 8px 0',
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-text-main)',
            }}
          >
            {termData.plainMeaning}
          </p>

          <div
            style={{
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-pill-warning-bg)',
              border: '1px solid var(--color-pill-warning-border)',
              marginBottom: '8px',
            }}
          >
            <div
              style={{
                fontWeight: 700,
                color: 'var(--color-pill-warning-ink)',
                marginBottom: '2px',
              }}
            >
              Everyday Analogy:
            </div>
            <div style={{ color: 'var(--color-text-main)' }}>{termData.analogy}</div>
          </div>

          <div
            style={{
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-bg-subtle)',
              border: '1px solid var(--color-border-subtle)',
              marginBottom: '8px',
            }}
          >
            <strong style={{ color: 'var(--color-text-main)' }}>Real Example: </strong>
            <span style={{ color: 'var(--color-text-muted)' }}>{termData.example}</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '4px',
            }}
          >
            <span style={{ color: 'var(--color-text-subtle)', fontSize: '11px' }}>
              On Gate.com: {termData.whereOnExchange}
            </span>
          </div>
        </div>
      )}
    </span>
  );
}
