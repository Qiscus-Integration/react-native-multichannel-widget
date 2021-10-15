import { usePrevious } from './use-previous';

export function useDifference<T>(value: T) {
  const prevValue = usePrevious(value);

  for (const key in value) {
    if (value[key] !== prevValue?.[key]) {
      console.log('Difference', key);
    }
  }
}
