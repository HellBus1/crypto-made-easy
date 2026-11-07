import { useEffect, useState } from 'react';
import { curriculum, type CurriculumItem } from '../../config/curriculum';
import { loadProgress, resetProgress } from '../../lib/progress';

interface CourseSidebarProps {
  currentSlug?: string;
}

const TRACK_GROUPS: { title: string; subtitle: string; items: CurriculumItem[] }[] = [
  {
    title: 'Track 1: Screen & Candle Basics',
    subtitle: 'Understand what is on a Gate.com chart',
    items: curriculum.filter((c) => c.chapter <= 2),
  },
  {
    title: 'Track 2: The 3-Light Checklist',
    subtitle: 'Indicators, floors, and buy/wait rules',
    items: curriculum.filter((c) => c.chapter >= 3 && c.chapter <= 5),
  },
  {
    title: 'Track 3: Protecting Your Cash',
    subtitle: 'Split entries, stop-loss, and calm mindset',
    items: curriculum.filter((c) => c.chapter >= 6),
  },
];

export default function CourseSidebar({ currentSlug }: CourseSidebarProps) {
  const [completed, setCompleted] = useState<string[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const sync = () => {
      setCompleted(loadProgress().completed);
    };
    sync();
    window.addEventListener('cme:progress-updated', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('cme:progress-updated', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const totalChapters = curriculum.length;
  const completedCount = curriculum.filter((c) => completed.includes(c.slug)).length;
  const pct = Math.round((completedCount / totalChapters) * 100);

  return (
    <aside aria-label="Course Curriculum Navigation">
      {/* Mobile Toggle Bar */}
      <div className="sidebar-mobile-bar">
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="btn-secondary"
          style={{ width: '100%', justifyContent: 'space-between' }}
          aria-expanded={mobileOpen}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            <span>
              Course Chapters ({completedCount}/{totalChapters} Done)
            </span>
          </span>
          <span
            className="num"
            style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-data-hue)' }}
          >
            {mobileOpen ? 'Hide' : 'Show All'}
          </span>
        </button>
      </div>

      <div className={`sidebar-panel ${mobileOpen ? 'sidebar-panel--open' : ''}`}>
        {/* Progress Widget (Like Blockchain Made Easy) */}
        <div
          style={{
            padding: 'var(--space-4)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border-default)',
            backgroundColor: 'var(--color-bg-surface)',
            marginBottom: 'var(--space-4)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '6px',
            }}
          >
            <strong style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-main)' }}>
              Your Learning Progress
            </strong>
            <span
              className="num"
              style={{
                fontSize: 'var(--font-size-xs)',
                fontWeight: 700,
                color: 'var(--color-data-hue)',
              }}
            >
              {pct}%
            </span>
          </div>

          <div
            style={{
              width: '100%',
              height: '8px',
              borderRadius: '9999px',
              backgroundColor: 'var(--color-bg-subtle)',
              border: '1px solid var(--color-border-subtle)',
              overflow: 'hidden',
              marginBottom: '8px',
            }}
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Course completion percentage"
          >
            <div
              style={{
                width: `${pct}%`,
                height: '100%',
                backgroundColor: 'var(--color-success)',
                transition: 'width 240ms ease',
              }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '11px',
              color: 'var(--color-text-subtle)',
            }}
          >
            <span className="num">
              {completedCount} of {totalChapters} chapters completed
            </span>
            {completedCount > 0 && (
              <button
                type="button"
                onClick={() => resetProgress()}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  fontSize: '11px',
                  color: 'var(--color-text-subtle)',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Track Groups */}
        <nav
          aria-label="Chapter List"
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}
        >
          {TRACK_GROUPS.map((group) => (
            <div
              key={group.title}
              style={{
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border-default)',
                backgroundColor: 'var(--color-bg-surface)',
              }}
            >
              <div style={{ marginBottom: 'var(--space-2)', paddingInline: '4px' }}>
                <div
                  style={{
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: 700,
                    color: 'var(--color-text-main)',
                  }}
                >
                  {group.title}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-subtle)' }}>
                  {group.subtitle}
                </div>
              </div>

              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                {group.items.map((item) => {
                  const isCurrent = item.slug === currentSlug;
                  const isDone = completed.includes(item.slug);

                  return (
                    <li key={item.slug}>
                      <a
                        href={`/learn/${item.slug}`}
                        aria-current={isCurrent ? 'page' : undefined}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px',
                          padding: '8px 10px',
                          borderRadius: 'var(--radius-md)',
                          textDecoration: 'none',
                          fontSize: 'var(--font-size-xs)',
                          fontWeight: isCurrent ? 700 : 500,
                          backgroundColor: isCurrent
                            ? 'var(--color-data-hue-subtle)'
                            : 'transparent',
                          color: isCurrent ? 'var(--color-text-main)' : 'var(--color-text-muted)',
                          border: isCurrent
                            ? '1px solid var(--color-data-hue)'
                            : '1px solid transparent',
                        }}
                      >
                        <span style={{ lineHeight: 1.35 }}>
                          {item.chapter}. {item.title}
                        </span>

                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '20px',
                            height: '20px',
                            borderRadius: '9999px',
                            flexShrink: 0,
                            fontSize: '11px',
                            fontWeight: 700,
                            backgroundColor: isDone
                              ? 'var(--color-pill-positive-bg)'
                              : isCurrent
                                ? 'var(--color-data-hue)'
                                : 'var(--color-bg-subtle)',
                            color: isDone
                              ? 'var(--color-pill-positive-ink)'
                              : isCurrent
                                ? '#ffffff'
                                : 'var(--color-text-subtle)',
                            border: isDone
                              ? '1px solid var(--color-pill-positive-border)'
                              : '1px solid var(--color-border-subtle)',
                          }}
                          title={
                            isDone
                              ? 'Completed'
                              : isCurrent
                                ? 'Current chapter'
                                : `Chapter ${item.chapter}`
                          }
                        >
                          {isDone ? (
                            <svg
                              width="11"
                              height="11"
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
                          ) : (
                            item.chapter
                          )}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <style>{`
        .sidebar-mobile-bar {
          display: block;
          margin-bottom: var(--space-3);
        }
        .sidebar-panel {
          display: none;
        }
        .sidebar-panel--open {
          display: block;
        }
        @media (min-width: 1024px) {
          .sidebar-mobile-bar {
            display: none;
          }
          .sidebar-panel {
            display: block !important;
          }
        }
      `}</style>
    </aside>
  );
}
