import { useAtomValue } from 'jotai/utils';
import { qiscusAtom } from '../state';

export function useQiscus() {
  return useAtomValue(qiscusAtom);
}
