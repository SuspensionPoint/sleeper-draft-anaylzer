import { DisplayedPick, DisplayedUserInfo } from '../components/models';

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

export const formattedPickSpot = (pick: DisplayedPick | undefined): string => {
  if (pick) {
    const round = pick.round;
    const pickNumber =
      pick.pick_no % pick.draftTeamCount === 0
        ? 1
        : pick.pick_no % pick.draftTeamCount;
    return `${round}.${pickNumber}`;
  }

  return '';
};

export const getSignedValueString = (value: number): string => {
  if (value == undefined) {
    return '';
  }

  const decimalPlaces = 2;
  return `${value && value < 0 ? '' : '+'}${value.toFixed(decimalPlaces)}`;
};

export const decimalToPercent = (val: number): number => {
  return Math.round(val * 100);
};
