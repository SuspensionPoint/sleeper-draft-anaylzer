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
  analysis: UserAnalysisReport;
}

export interface MostDraftedPlayer {
  player: DisplayedPlayer;
  draftedCount: number;
  picks: DisplayedPick[];
}

export interface Reach {
  picks: DisplayedPick[];
  picksAboveAdp: number;
  roundNumber?: number;
  pickNumber?: number;
  draftedCount: number;
}

export interface FavoritePositionalPick {
  player: DisplayedPlayer;
  picks: DisplayedPick[];
  position: string;
  avgRoundNumber: number;
  avgPickNumber: number;
}

export interface RoundAnalysis {
  round: number;
  mostDraftedPosition: string[];
  mostDraftedPositionCount: number;
  probabilityToDraftedPosition: number;
}

export interface UserAnalysisReport {
  mostDraftedPlayer: MostDraftedPlayer;
  biggestReach?: Reach;
  mostCommonReach?: Reach;
  topFiveReaches: Reach[];
  averagePickValue: number;

  favoriteQB: FavoritePositionalPick;
  favoriteRB: FavoritePositionalPick;
  favoriteWR: FavoritePositionalPick;
  favoriteTE: FavoritePositionalPick;

  firstRoundAnalysis: RoundAnalysis;
  secondRoundAnalysis: RoundAnalysis;
  thirdRoundAnalysis: RoundAnalysis;
}
