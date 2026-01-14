import { useEffect, useRef } from 'react';

export const usePerformanceMonitor = (componentName: string) => {
  const renderCount = useRef(0);
  const startTime = useRef<number>(Date.now());

  useEffect(() => {
    renderCount.current += 1;
    const renderTime = Date.now() - startTime.current;
    
    // Logger en développement uniquement
    if (import.meta.env.DEV) {
      console.log(`🚀 ${componentName} Performance:`, {
        renderTime: `${renderTime}ms`,
        renderCount: renderCount.current,
        timestamp: new Date().toISOString()
      });
    }

    // Alerter si le rendu est lent (>100ms)
    if (renderTime > 100) {
      console.warn(`⚠️ ${componentName} rendu lent: ${renderTime}ms`);
    }

    startTime.current = Date.now();
  });

  return {
    renderCount: renderCount.current,
    getLastRenderTime: () => Date.now() - startTime.current
  };
};

export const measurePerformance = <T extends (...args: any[]) => any>(
  fn: T,
  name: string
): T => {
  return ((...args: Parameters<T>) => {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();
    
    if (import.meta.env.DEV) {
      console.log(`⏱️ ${name} exécuté en ${(end - start).toFixed(2)}ms`);
    }
    
    return result;
  }) as T;
};
