import React, { useEffect, useRef, useState } from 'react';

export function useAutoSave<T>(
  watchFn: () => T,
  saveFn: (data: T) => Promise<void>,
  delay = 2000
) {
  const data = watchFn();
  const debouncedData = useDebounce(data, delay);
  const initialRender = useRef(true);
  const previousData = useRef<T>();

  useEffect(() => {
    // Skip first render to avoid saving initial/default values
    if (initialRender.current) {
      initialRender.current = false;
      previousData.current = debouncedData;
      return;
    }

    // Skip if data hasn't changed
    if (JSON.stringify(previousData.current) === JSON.stringify(debouncedData)) {
      return;
    }

    // Skip if data is empty or only contains empty values
    if (isEmptyData(debouncedData)) {
      return;
    }

    previousData.current = debouncedData;
    saveFn(debouncedData);
  }, [debouncedData, saveFn]);
}

function useDebounce<T>(value: T, delay: number): T {
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

function isEmptyData(data: any): boolean {
  if (data === null || data === undefined) return true;
  
  if (typeof data === 'string') return data.trim() === '';
  
  if (typeof data === 'object') {
    if (Array.isArray(data)) return data.length === 0;
    
    const values = Object.values(data);
    return values.every(value => {
      if (value === null || value === undefined) return true;
      if (typeof value === 'string') return value.trim() === '';
      if (Array.isArray(value)) return value.length === 0;
      return false;
    });
  }
  
  return false;
}
