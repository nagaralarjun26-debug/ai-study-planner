// Date utility helpers

/**
 * Format a date string (YYYY-MM-DD) to a readable format like "Jun 1, 2024"
 */
export const formatDate = (dateStr: string): string => {
  if (!dateStr) return 'No deadline';
  const date = new Date(dateStr + 'T00:00:00'); // Force local time
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Returns how many days are left until a deadline.
 * Negative = overdue, 0 = today, positive = days remaining
 */
export const daysUntil = (dateStr: string): number => {
  if (!dateStr) return Infinity;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(dateStr + 'T00:00:00');
  return Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

/**
 * Returns a label like "2 days left", "Today", "3 days overdue"
 */
export const deadlineLabel = (dateStr: string): { text: string; status: 'ok' | 'soon' | 'urgent' | 'overdue' } => {
  if (!dateStr) return { text: 'No deadline', status: 'ok' };
  const days = daysUntil(dateStr);
  if (days < 0) return { text: `${Math.abs(days)}d overdue`, status: 'overdue' };
  if (days === 0) return { text: 'Due today!', status: 'urgent' };
  if (days <= 3) return { text: `${days}d left`, status: 'urgent' };
  if (days <= 7) return { text: `${days}d left`, status: 'soon' };
  return { text: `${days}d left`, status: 'ok' };
};

/**
 * Returns today's date as YYYY-MM-DD (for default form values)
 */
export const todayStr = (): string => {
  return new Date().toISOString().split('T')[0];
};
