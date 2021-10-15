import appStateAtom from '../state';
import type { AppState } from '../types';
import { useAtomValue } from 'jotai/utils';

export function useAppState(): AppState {
  return useAtomValue(appStateAtom);
}
