import { useEffect } from 'react';

export function useUndoTimer(
  expiresAt: number,
  onExpire: () => void,
): void {
  useEffect(() => {
    const remaining = expiresAt - Date.now();
    if (remaining <= 0) {
      onExpire();
      return;
    }
    const timeoutId = window.setTimeout(onExpire, remaining);
    return () => window.clearTimeout(timeoutId);
  }, [expiresAt, onExpire]);
}
