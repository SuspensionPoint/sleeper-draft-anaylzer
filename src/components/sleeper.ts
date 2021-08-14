import { DisplayedPick } from './models';

const SLEEPER_DRAFT_URL = 'https://sleeper.app/draft/nfl/';

export const openDraftUrl = (pick: DisplayedPick) => {
  const url = SLEEPER_DRAFT_URL + pick.draft_id;
  window.open(url, '_blank' + pick.draft_id);
};
