import type { Getter, Setter } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import { useAsyncEffect } from './use-async-effect';

export function useAtomCallbackSubscription(
  cb: (get: Getter, set: Setter, isMounted: () => boolean) => () => void,
  inputs?: unknown[]
) {
  const listener = useAtomCallback(cb);
  const _inputs = inputs || [];
  useAsyncEffect(
    listener,
    (destroy) => {
      destroy?.();
    },
    [listener, ..._inputs]
  );
}
