import type { Getter, Setter } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import { useCallback } from 'react';

interface ICb<Arg, Ret> {
  (get: Getter, set: Setter, arg: Arg): Ret extends Promise<infer R> ? R : Ret;
}

export function useAtomCallbackWithDeps<Arg, Ret>(
  cb: ICb<Arg, Ret>,
  deps: unknown[]
) {
  return useAtomCallback(useCallback(cb, [cb, ...deps]));
}
