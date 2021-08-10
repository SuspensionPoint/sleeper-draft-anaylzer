import { User, Pick, Player } from 'src/api';

// fantasyfootballcalculator's model
export interface PlayerADP {
  player_id: number;
  name: string;
  position: string;
  team: string;
  adp: number;
  adp_formatted: string;
  times_drafted: number;
  high: number;
  low: number;
  stdev: number;
  bye: number;
}

export interface DisplayedPlayer extends Player {
  full_name: string;
  adp?: number;
  adp_formatted?: string;
}

export interface DisplayedPick extends Pick {
  player: DisplayedPlayer;
  draftTeamCount: number;
}

export interface DisplayedUserInfo extends User {
  picks: DisplayedPick[];
}

export interface MostDraftedPlayer {
  player: DisplayedPlayer;
  draftedCount: number;
}

export interface BiggestReach {
  pick: DisplayedPick;
  picksAboveAdp: number;
}

export interface UserAnalysisReport {
  userInfo: DisplayedUserInfo;
  mostDraftedPlayer: MostDraftedPlayer;
  biggestReach: BiggestReach;
  averagePickValue: number;
}
