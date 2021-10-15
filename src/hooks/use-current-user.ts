import { currentUserAtom } from '../state';
import { useAtomValue } from 'jotai/utils';
import type { User } from '../types';

export function useCurrentUser(): User | undefined {
  return useAtomValue(currentUserAtom);
}
