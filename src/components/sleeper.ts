import { DisplayedPick } from './models';

const SLEEPER_DRAFT_URL = 'https://sleeper.app/draft/nfl/';

export const openDraftUrl = (pick: DisplayedPick) => {
  const url = SLEEPER_DRAFT_URL + pick.draft_id;
  window.open(url, '_blank' + pick.draft_id);
};

export const getPickNumbers = (
  pickNumber: number,
  numTeams: number,
  numRounds: number
): number[] => {
  let DT = 2;
  const C = numTeams;
  const N = pickNumber;
  const picks = [];

  let counter = 0;
  for (let i = 1; i <= numRounds; i++) {
    if (i === 1) {
      picks.push(N);
    } else {
      // even
      if (i % 2 === 0) {
        const value = DT * C + 1 - N;
        picks.push(value);
      }
      // odd
      else {
        const value = N + DT * C;
        picks.push(value);
      }

      if (counter >= 2) {
        DT = DT + 2;
        counter = 0;
      }
    }
    counter++;
  }

  return picks;
};
