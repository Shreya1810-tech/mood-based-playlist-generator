import { useCallback } from 'react';

export default function useHaptic() {
  const vibrate = useCallback((pattern = 15) => {
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }, []);

  const tap = useCallback(() => vibrate(10), [vibrate]);
  const success = useCallback(() => vibrate([15, 30, 15]), [vibrate]);
  const error = useCallback(() => vibrate([40, 20, 40]), [vibrate]);
  const heavy = useCallback(() => vibrate(30), [vibrate]);
  const selection = useCallback(() => vibrate(5), [vibrate]);

  return { vibrate, tap, success, error, heavy, selection };
}
