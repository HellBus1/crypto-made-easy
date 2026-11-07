import { useEffect, useState } from 'react';
import { curriculum } from '../../config/curriculum';
import { loadProgress } from '../../lib/progress';

interface ChapterProgressProps {
  chapter: number;
  slug: string;
  track: string;
  durationMinutes: number;
}

export default function ChapterProgress({
  chapter,
  slug,
  track,
  durationMinutes,
}: ChapterProgressProps) {
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const sync = () => {
      setIsDone(loadProgress().completed.includes(slug));
    };
    sync();
    window.addEventListener('cme:progress-updated', sync);
    return () => window.removeEventListener('cme:progress-updated', sync);
  }, [slug]);

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--space-2)',
        padding: 'var(--space-3) var(--space-4)',
        borderRadius: 'var(--radius-lg)',
        backgroundColor: 'var(--color-bg-subtle)',
        border: '1px solid var(--color-border-default)',
        marginBottom: 'var(--space-5)',
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
        <span className="status-pill status-pill--info">
          Chapter {chapter} of {curriculum.length}
        </span>
        <span className="status-pill status-pill--neutral">{track}</span>
        <span
          className="num"
          style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}
        >
          {durationMinutes} min interactive lesson
        </span>
      </div>

      <div>
        {isDone ? (
          <span className="status-pill status-pill--positive">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="2 6 5 9 10 3" />
            </svg>
            Completed
          </span>
        ) : (
          <a
            href="#chapter-complete-box"
            style={{
              fontSize: 'var(--font-size-xs)',
              fontWeight: 600,
              color: 'var(--color-data-hue)',
            }}
          >
            Jump to completion check &darr;
          </a>
        )}
      </div>
    </div>
  );
}
