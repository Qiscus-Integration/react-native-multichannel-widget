import { useAtomCallback } from 'jotai/utils';
import { qiscusAtom } from '../state';

export function useRemoveNotification(): (deviceId: string) => Promise<void> {
  let cb = useAtomCallback(async (get, __, deviceId: string) => {
    await get(qiscusAtom).removeDeviceToken(deviceId, false);
  });

  return cb;
}
