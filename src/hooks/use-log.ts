import { useEffect } from 'react';

export function useLog(...args: unknown[]) {
  useEffect(() => console.log(...args), args);
}
