import { DisplayedUserInfo } from '../components/models';

export const getPlayerImageUrl = (playerId: string | undefined): string => {
  if (playerId) {
    return `https://sleepercdn.com/content/nfl/players/thumb/${playerId}.jpg`;
  }

  return '';
};

export const getAvatarUrl = (
  userInfo: DisplayedUserInfo | undefined
): string => {
  if (userInfo?.avatar) {
    return `https://sleepercdn.com/avatars/${userInfo?.avatar}`;
  } else {
    return '';
  }
};
