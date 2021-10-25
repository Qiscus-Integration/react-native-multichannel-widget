import { useMemo } from 'react';
import {
  leftBubbleTextColorThemeAtom,
  rightBubbleTextColorThemeAtom,
} from '../state';
import { useComputedAtomValue } from './use-computed-atom-value';
import { useCurrentUser } from './use-current-user';

export function useBubbleFgColor(senderId: string): string {
  const currentUser = useCurrentUser();

  const isSelf = useMemo(
    () => senderId === currentUser?.id,
    [currentUser?.id, senderId]
  );
  const bubbleFgColor = useComputedAtomValue((get) => {
    return isSelf
      ? get(rightBubbleTextColorThemeAtom)
      : get(leftBubbleTextColorThemeAtom);
  });

  return bubbleFgColor;
}
