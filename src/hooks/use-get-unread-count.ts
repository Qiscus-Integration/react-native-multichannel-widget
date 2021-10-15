import { qiscusAtom, unreadCountAtom } from '../state';
import { useAtomCallback } from 'jotai/utils';

export function useGetUnreadCount() {
  let cb = useAtomCallback(async (get, set) => {
    let unreadCount = await get(qiscusAtom).getTotalUnreadCount();
    set(unreadCountAtom, unreadCount);

    return unreadCount;
  });

  return cb;
}
