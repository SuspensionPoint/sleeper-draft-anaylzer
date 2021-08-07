export const getPlayerImageUrl = (playerId: string | undefined): string => {
  if (playerId) {
    return `https://sleepercdn.com/content/nfl/players/thumb/${playerId}.jpg`;
  }

  return '';
};
