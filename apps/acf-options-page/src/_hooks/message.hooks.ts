import { EffectCallback, useEffect, useRef } from 'react';

export const useTimeout = (effect: EffectCallback, deps?: string) => {
  const timeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear the previous timeout when the dependencies change or the component unmounts
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, [deps]);

  useEffect(() => {
    if (deps) {
      // Set a new timeout when the dependencies change
      timeout.current = setTimeout(effect, 2000);
      // Clear the timeout if the component unmounts
      return () => {
        if (timeout.current) {
          clearTimeout(timeout.current);
        }
      };
    }
  }, [deps, effect]);
};
