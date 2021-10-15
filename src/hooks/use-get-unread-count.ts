import { qiscusAtom } from '../state';
import { useAtomCallback } from 'jotai/utils';

export function useGetUnreadCount() {
  let cb = useAtomCallback(async (get, _set) => {
    let unreadCount = await get(qiscusAtom).getTotalUnreadCount();
    // set(unreadCountAtom, unreadCount);

    return unreadCount;
  });

  return cb;
}
