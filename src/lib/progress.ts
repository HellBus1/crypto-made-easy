export const PROGRESS_STORAGE_KEY = 'cme:v1';

export interface CourseProgressState {
  schemaVersion: 1;
  completed: string[];
}

const DEFAULT_STATE: CourseProgressState = {
  schemaVersion: 1,
  completed: [],
};

export function loadProgress(): CourseProgressState {
  if (typeof window === 'undefined') {
    return DEFAULT_STATE;
  }

  try {
    const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<CourseProgressState>;
    if (
      parsed &&
      parsed.schemaVersion === 1 &&
      Array.isArray(parsed.completed) &&
      parsed.completed.every((item) => typeof item === 'string')
    ) {
      return {
        schemaVersion: 1,
        completed: Array.from(new Set(parsed.completed)),
      };
    }
    return DEFAULT_STATE;
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveProgress(completed: string[]): CourseProgressState {
  const nextState: CourseProgressState = {
    schemaVersion: 1,
    completed: Array.from(new Set(completed)),
  };

  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(nextState));
      window.dispatchEvent(new CustomEvent('cme:progress-updated', { detail: nextState }));
    } catch {
      // Ignore storage quota errors safely
    }
  }

  return nextState;
}

export function toggleChapterComplete(slug: string): CourseProgressState {
  const current = loadProgress();
  const exists = current.completed.includes(slug);
  const nextCompleted = exists
    ? current.completed.filter((id) => id !== slug)
    : [...current.completed, slug];
  return saveProgress(nextCompleted);
}

export function markChapterComplete(slug: string): CourseProgressState {
  const current = loadProgress();
  if (current.completed.includes(slug)) {
    return current;
  }
  return saveProgress([...current.completed, slug]);
}

export function resetProgress(): CourseProgressState {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem(PROGRESS_STORAGE_KEY);
      window.dispatchEvent(new CustomEvent('cme:progress-updated', { detail: DEFAULT_STATE }));
    } catch {
      // Ignore storage errors safely
    }
  }
  return DEFAULT_STATE;
}
