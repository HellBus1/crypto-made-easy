import { useState } from 'react';
import { CHAPTER_QUIZZES } from '../../data/quizzes';

export interface ChapterQuizProps {
  chapter: number;
}

export default function ChapterQuiz({ chapter }: ChapterQuizProps) {
  const quizSet = CHAPTER_QUIZZES[chapter];
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});

  if (!quizSet) return null;

  const answeredCount = Object.keys(selectedAnswers).length;
  const totalCount = quizSet.questions.length;
  const correctCount = quizSet.questions.filter(
    (q) => selectedAnswers[q.id] === q.correctIndex
  ).length;

  const handleSelect = (questionId: string, optionIdx: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const handleReset = () => {
    setSelectedAnswers({});
  };

  return (
    <section
      id={`chapter-quiz-${chapter}`}
      className="sim-box chapter-quiz-box"
      data-ui="chapter-quiz"
      data-testid={`chapter-quiz-${chapter}`}
      aria-labelledby={`chapter-quiz-heading-${chapter}`}
    >
      <div className="chapter-quiz-header">
        <div>
          <span className="status-pill status-pill--info">
            Chapter {chapter} Decision Drill · Real-Life Practice
          </span>
          <h2 id={`chapter-quiz-heading-${chapter}`} style={{ marginTop: 8, marginBottom: 4 }}>
            Quick Scenario Quiz: {quizSet.title}
          </h2>
          <p className="text-muted" style={{ fontSize: 'var(--font-size-xs)', margin: 0 }}>
            Test what you would actually click on a live Spot screen (instant feedback, zero grade
            pressure).
          </p>
        </div>

        <div className="chapter-quiz-score num" data-testid={`quiz-score-${chapter}`}>
          Score: {correctCount} / {totalCount}
        </div>
      </div>

      <div className="chapter-quiz-list">
        {quizSet.questions.map((q, qIdx) => {
          const picked = selectedAnswers[q.id];
          const hasPicked = picked !== undefined;
          const isCorrect = picked === q.correctIndex;

          return (
            <div key={q.id} className="chapter-quiz-item" data-testid={`quiz-question-${q.id}`}>
              <p className="chapter-quiz-scenario">
                <strong>Scenario {qIdx + 1}:</strong> {q.scenario}
              </p>

              <div
                className="chapter-quiz-options"
                role="group"
                aria-label={`Scenario ${qIdx + 1}`}
              >
                {q.options.map((opt, optIdx) => {
                  const active = picked === optIdx;
                  const rightChoice = hasPicked && optIdx === q.correctIndex;
                  const wrongChoice = active && !rightChoice;

                  let stateClass = '';
                  if (rightChoice) stateClass = 'quiz-opt--correct';
                  else if (wrongChoice) stateClass = 'quiz-opt--wrong';
                  else if (active) stateClass = 'quiz-opt--active';

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      className={`quiz-opt-btn ${stateClass}`}
                      onClick={() => handleSelect(q.id, optIdx)}
                      aria-pressed={active}
                      data-testid={`quiz-opt-${q.id}-${optIdx}`}
                    >
                      <span className="quiz-opt-letter num">
                        {String.fromCharCode(65 + optIdx)}.
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {hasPicked && (
                <div
                  className={
                    isCorrect
                      ? 'quiz-feedback quiz-feedback--correct'
                      : 'quiz-feedback quiz-feedback--wrong'
                  }
                  role="status"
                  data-testid={`quiz-feedback-${q.id}`}
                >
                  <strong>
                    {isCorrect ? '\u2713 Solid Decision:' : '\u2715 Not Ideal -- Check the Rule:'}
                  </strong>{' '}
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {answeredCount > 0 && (
        <div className="chapter-quiz-footer">
          <span>
            {answeredCount === totalCount
              ? correctCount === totalCount
                ? `All ${totalCount} scenarios nailed! You can apply Chapter ${chapter} under live conditions.`
                : `Completed ${answeredCount}/${totalCount}. Review the notes above, then try again if helpful.`
              : `Answered ${answeredCount} of ${totalCount} scenarios.`}
          </span>
          <button type="button" className="btn-secondary" onClick={handleReset}>
            Retry Quiz
          </button>
        </div>
      )}

      <style>{`
        .chapter-quiz-box {
          margin-top: var(--space-6);
        }

        .chapter-quiz-header {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          justify-content: space-between;
          gap: var(--space-3);
          margin-bottom: var(--space-4);
        }

        .chapter-quiz-score {
          padding: 6px 12px;
          border-radius: var(--radius-md);
          background-color: var(--color-bg-surface);
          border: 1px solid var(--color-border-default);
          font-size: var(--font-size-xs);
          font-weight: 700;
        }

        .chapter-quiz-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .chapter-quiz-item {
          padding: var(--space-4);
          border-radius: var(--radius-md);
          background-color: var(--color-bg-surface);
          border: 1px solid var(--color-border-default);
        }

        .chapter-quiz-scenario {
          margin: 0 0 var(--space-3) 0;
          font-size: var(--font-size-sm);
          line-height: 1.5;
        }

        .chapter-quiz-options {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .quiz-opt-btn {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          width: 100%;
          padding: 10px 12px;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border-default);
          background-color: var(--color-bg-canvas);
          color: var(--color-text-main);
          font-size: var(--font-size-xs);
          line-height: 1.45;
          text-align: left;
          cursor: pointer;
          transition: border-color 0.15s ease, background-color 0.15s ease;
        }

        .quiz-opt-btn:hover {
          border-color: var(--color-data-hue);
        }

        .quiz-opt-letter {
          font-weight: 700;
          color: var(--color-data-hue);
        }

        .quiz-opt--correct {
          border-color: var(--color-pill-positive-border);
          background-color: var(--color-pill-positive-bg);
        }

        .quiz-opt--wrong {
          border-color: var(--color-pill-negative-border);
          background-color: var(--color-pill-negative-bg);
        }

        .quiz-feedback {
          margin-top: var(--space-3);
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius-md);
          font-size: var(--font-size-xs);
          line-height: 1.5;
        }

        .quiz-feedback--correct {
          background-color: var(--color-pill-positive-bg);
          border: 1px solid var(--color-pill-positive-border);
          color: var(--color-text-main);
        }

        .quiz-feedback--wrong {
          background-color: var(--color-pill-warning-bg);
          border: 1px solid var(--color-pill-warning-border);
          color: var(--color-text-main);
        }

        .chapter-quiz-footer {
          margin-top: var(--space-4);
          padding-top: var(--space-3);
          border-top: 1px solid var(--color-border-subtle);
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-3);
          font-size: var(--font-size-xs);
          color: var(--color-text-muted);
        }
      `}</style>
    </section>
  );
}
