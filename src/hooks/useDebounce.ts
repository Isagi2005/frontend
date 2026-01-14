import { useState, useEffect } from 'react';

/**
 * Hook pour débounce les valeurs
 * @param value Valeur à debounce
 * @param delay Délai en ms
 * @returns Valeur débounceée
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
