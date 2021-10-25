import { useMemo } from 'react';
import { leftBubbleColorThemeAtom, rightBubbleColorThemeAtom } from '../state';
import { useComputedAtomValue } from './use-computed-atom-value';
import { useCurrentUser } from './use-current-user';

export function useBubbleBgColor(senderId: string): string {
  const currentUser = useCurrentUser();

  const isSelf = useMemo(
    () => senderId === currentUser?.id,
    [currentUser?.id, senderId]
  );
  const bubbleBgColor = useComputedAtomValue((get) => {
    return isSelf
      ? get(rightBubbleColorThemeAtom)
      : get(leftBubbleColorThemeAtom);
  });

  return bubbleBgColor;
}
