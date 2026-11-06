import { useEffect, useState } from 'react';
import { curriculum } from '../../config/curriculum';
import { loadProgress, toggleChapterComplete } from '../../lib/progress';

interface ChapterCompleteProps {
  slug: string;
  chapter: number;
  title: string;
}

export default function ChapterComplete({ slug, chapter, title }: ChapterCompleteProps) {
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setCompleted(loadProgress().completed);
    sync();
    window.addEventListener('cme:progress-updated', sync);
    return () => window.removeEventListener('cme:progress-updated', sync);
  }, []);

  const isDone = completed.includes(slug);
  const prevItem = curriculum.find((c) => c.chapter === chapter - 1);
  const nextItem = curriculum.find((c) => c.chapter === chapter + 1);

  return (
    <div id="chapter-complete-box" style={{ marginTop: 'var(--space-10)' }}>
      {/* Completion Action Card (Like Blockchain Made Easy's ChapterSeal) */}
      <div
        style={{
          padding: 'var(--space-5)',
          borderRadius: 'var(--radius-xl)',
          border: `1px solid ${
            isDone ? 'var(--color-pill-positive-border)' : 'var(--color-border-default)'
          }`,
          backgroundColor: isDone ? 'var(--color-pill-positive-bg)' : 'var(--color-bg-surface)',
          marginBottom: 'var(--space-5)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-4)',
          }}
        >
          <div style={{ maxWidth: '54ch' }}>
            <div
              style={{
                fontSize: 'var(--font-size-xs)',
                fontWeight: 700,
                color: isDone ? 'var(--color-pill-positive-ink)' : 'var(--color-data-hue)',
                marginBottom: '4px',
              }}
            >
              {isDone ? 'CHAPTER COMPLETED' : `FINISH CHAPTER ${chapter}`}
            </div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: 'var(--font-size-lg)' }}>
              {isDone
                ? `Great job finishing "${title}"!`
                : `Finished reading and testing the simulator?`}
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-muted)',
              }}
            >
              {isDone
                ? 'Your progress is saved locally in this browser. You can move to the next chapter or test a live coin in the Signal Helper.'
                : 'Mark this chapter complete to update your progress bar in the sidebar.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => toggleChapterComplete(slug)}
            className={isDone ? 'btn-secondary' : 'btn-primary'}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{isDone ? 'Completed (Click to Undo)' : `Mark Chapter ${chapter} Complete`}</span>
          </button>
        </div>
      </div>

      {/* Prev / Next Chapter Navigation Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 'var(--space-3)',
        }}
      >
        {prevItem ? (
          <a
            href={`/learn/${prevItem.slug}`}
            className="surface-card"
            style={{
              padding: 'var(--space-4)',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-subtle)' }}>
              &larr; Previous Lesson
            </span>
            <strong style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-main)' }}>
              Chapter {prevItem.chapter}: {prevItem.title}
            </strong>
          </a>
        ) : (
          <a
            href="/"
            className="surface-card"
            style={{
              padding: 'var(--space-4)',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-subtle)' }}>
              &larr; Home Overview
            </span>
            <strong style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-main)' }}>
              Back to Beginner Start Page
            </strong>
          </a>
        )}

        {nextItem ? (
          <a
            href={`/learn/${nextItem.slug}`}
            className="surface-card"
            style={{
              padding: 'var(--space-4)',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              borderColor: 'var(--color-data-hue)',
              backgroundColor: 'var(--color-data-hue-subtle)',
            }}
          >
            <span
              style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-data-hue)',
                fontWeight: 700,
              }}
            >
              Next Lesson &rarr;
            </span>
            <strong style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-main)' }}>
              Chapter {nextItem.chapter}: {nextItem.title}
            </strong>
          </a>
        ) : (
          <a
            href="/checker"
            className="surface-card"
            style={{
              padding: 'var(--space-4)',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              borderColor: 'var(--color-data-hue)',
              backgroundColor: 'var(--color-data-hue-subtle)',
            }}
          >
            <span
              style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-data-hue)',
                fontWeight: 700,
              }}
            >
              Course Complete &rarr;
            </span>
            <strong style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-main)' }}>
              Open the 3-Light Spot Signal Helper
            </strong>
          </a>
        )}
      </div>
    </div>
  );
}
