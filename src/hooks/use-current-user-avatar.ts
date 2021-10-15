import { useCurrentUser } from './use-current-user';

export function useCurrentUserAvatar() {
  let user = useCurrentUser();

  if (user?.avatarUrl == null)
    return require('../assets/default-user-avatar.png');
  return { uri: user.avatarUrl };
}
