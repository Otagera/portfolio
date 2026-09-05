export function formatRelativeTime(unixSeconds: number, nowMs: number = Date.now()): string {
  const diffSeconds = Math.max(0, Math.round(nowMs / 1000 - unixSeconds));

  if (diffSeconds < 60) return 'just now';

  const minutes = Math.round(diffSeconds / 60);
  if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'} ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;

  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}
