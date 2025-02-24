import { atom, useAtom } from 'jotai';
import type { Getter } from 'jotai';
import { useAtomValue } from 'jotai/utils';

export function useComputedAtomValue<R>(cb: (get: Getter) => R) {
  return useAtomValue(atom(cb));
}

export function useComputedAtom<R>(cb: (get: Getter) => R) {
  return useAtom(atom(cb));
}
