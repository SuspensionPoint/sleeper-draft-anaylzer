import { User, Pick, Player } from 'src/api';

export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}

export interface DisplayedPlayer extends Player {
  full_name: string;
  adp?: number;
  adp_formatted?: string;
}

export interface DisplayedPick extends Pick {
  player: DisplayedPlayer;
}

export interface DisplayedUserInfo extends User {
  picks: DisplayedPick[];
}

export interface MostDraftedPlayer {
  player: DisplayedPlayer;
  draftedCount: number;
}

export interface BiggestReach {
  player: DisplayedPlayer;
  picksAboveAdp: number;
}

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
