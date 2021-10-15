import { useEffect } from 'react';

type IEffect<T> = (isMountedCb: () => boolean) => PromiseLike<T> | T;
type IDestroy<T> = (value: T) => void;
type IInput = unknown[];

export function useAsyncEffect<T>(
  effect: IEffect<T>,
  destroy?: IDestroy<T>,
  inputs?: IInput
) {
  const hasDestroy = typeof destroy === 'function';

  useEffect(
    function () {
      let result: T;
      var mounted = true;
      var maybePromise = effect(function () {
        return mounted;
      });

      Promise.resolve(maybePromise).then(function (value) {
        result = value;
      });

      return function () {
        mounted = false;

        if (hasDestroy) {
          destroy?.(result);
        }
      };
    },
    [destroy, inputs, effect, hasDestroy]
  );
}
