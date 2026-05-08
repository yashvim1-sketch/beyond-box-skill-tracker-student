const KEY_PREFIX = "bb_book_";

export function saveBookRating(bookId, ratings) {
  const allValues = Object.values(ratings);
  const averageScore = allValues.reduce((sum, v) => sum + v, 0) / allValues.length;
  const data = {
    bookId,
    ratings,
    completedAt: new Date().toISOString(),
    averageScore: Math.round(averageScore * 100) / 100
  };
  localStorage.setItem(`${KEY_PREFIX}${bookId}`, JSON.stringify(data));
  return data;
}

export function getBookRating(bookId) {
  const raw = localStorage.getItem(`${KEY_PREFIX}${bookId}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getAllRatings() {
  const result = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(KEY_PREFIX)) {
      try {
        const parsed = JSON.parse(localStorage.getItem(key));
        if (parsed) result.push(parsed);
      } catch {
        // ignore corrupt entries
      }
    }
  }
  return result;
}

export function clearBookRating(bookId) {
  localStorage.removeItem(`${KEY_PREFIX}${bookId}`);
}

export function clearAll() {
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(KEY_PREFIX)) keysToRemove.push(key);
  }
  keysToRemove.forEach(k => localStorage.removeItem(k));
}
