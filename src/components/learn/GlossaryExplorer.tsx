import { useState } from 'react';
import { TERM_LIST, type TermCategory } from '../../data/terms';

const CATEGORIES: ('All' | TermCategory)[] = [
  'All',
  'Screen Basics',
  'The 3 Lights',
  'Price Zones',
  'Orders & Safety',
];

export default function GlossaryExplorer() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | TermCategory>('All');

  const normalizedQuery = query.trim().toLowerCase();

  const filteredTerms = TERM_LIST.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    if (!matchesCategory) return false;
    if (!normalizedQuery) return true;
    return (
      item.name.toLowerCase().includes(normalizedQuery) ||
      item.plainMeaning.toLowerCase().includes(normalizedQuery) ||
      item.analogy.toLowerCase().includes(normalizedQuery) ||
      item.example.toLowerCase().includes(normalizedQuery)
    );
  });

  return (
    <div data-ui="glossary-explorer">
      {/* Search & Filter Controls */}
      <div
        className="surface-card"
        style={{
          padding: 'var(--space-4)',
          marginBottom: 'var(--space-5)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-3)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-3)',
          }}
        >
          <div style={{ flex: '1 1 260px' }}>
            <label
              htmlFor="glossary-search"
              style={{
                display: 'block',
                fontSize: 'var(--font-size-xs)',
                fontWeight: 700,
                marginBottom: '4px',
                color: 'var(--color-text-main)',
              }}
            >
              Search any chart word or abbreviation (e.g., RSI, MA30, Wick, Support, USDT)
            </label>
            <input
              id="glossary-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a word you saw on Gate.com..."
              style={{
                width: '100%',
                height: 'var(--control-height)',
                paddingInline: 'var(--space-3)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border-control)',
                backgroundColor: 'var(--color-bg-canvas)',
                color: 'var(--color-text-main)',
                fontSize: 'var(--font-size-sm)',
              }}
            />
          </div>

          <div>
            <div
              style={{
                fontSize: 'var(--font-size-xs)',
                fontWeight: 700,
                marginBottom: '4px',
                color: 'var(--color-text-main)',
              }}
            >
              Filter by Topic
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {CATEGORIES.map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={active ? 'btn-primary' : 'btn-secondary'}
                    style={{
                      minHeight: '34px',
                      padding: '4px 12px',
                      fontSize: 'var(--font-size-xs)',
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div
        style={{
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-text-muted)',
          marginBottom: 'var(--space-3)',
        }}
      >
        Showing <strong className="num">{filteredTerms.length}</strong> of{' '}
        <strong className="num">{TERM_LIST.length}</strong> beginner definitions
      </div>

      {/* Term Cards Grid (Like Blockchain Made Easy Glossary) */}
      {filteredTerms.length === 0 ? (
        <div className="surface-card" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          <h3 style={{ marginBottom: '8px' }}>No matching term found</h3>
          <p
            className="text-muted"
            style={{ fontSize: 'var(--font-size-sm)', marginBottom: '12px' }}
          >
            Try clearing your search or selecting &ldquo;All&rdquo; topics above.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSelectedCategory('All');
            }}
            className="btn-secondary"
          >
            Show All Terms
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 'var(--space-4)',
          }}
        >
          {filteredTerms.map((item) => (
            <article
              key={item.id}
              id={item.id}
              className="surface-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 'var(--space-3)',
                scrollMarginTop: '5rem',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '8px',
                    marginBottom: 'var(--space-2)',
                  }}
                >
                  <h2 style={{ fontSize: 'var(--font-size-base)', margin: 0 }}>{item.name}</h2>
                  <span className="status-pill status-pill--info">{item.category}</span>
                </div>

                <p style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-3)' }}>
                  {item.plainMeaning}
                </p>

                <div className="analogy-callout" style={{ marginBlock: '0 var(--space-3)' }}>
                  <div className="analogy-callout__header">Everyday Analogy</div>
                  <p>{item.analogy}</p>
                </div>

                <div
                  style={{
                    padding: 'var(--space-3)',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-bg-subtle)',
                    border: '1px solid var(--color-border-subtle)',
                    fontSize: 'var(--font-size-xs)',
                  }}
                >
                  <strong>Real Example: </strong>
                  <span style={{ color: 'var(--color-text-muted)' }}>{item.example}</span>
                </div>
              </div>

              <div
                style={{
                  paddingTop: 'var(--space-2)',
                  borderTop: '1px solid var(--color-border-subtle)',
                  fontSize: '11px',
                  color: 'var(--color-text-subtle)',
                }}
              >
                <strong>Where on Gate.com:</strong> {item.whereOnExchange}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
