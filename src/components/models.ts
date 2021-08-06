import { User, Pick, Player } from 'src/api';

export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}

export interface DisplayedPick extends Pick {
  player: Player;
}

export interface DisplayedUserInfo extends User {
  picks: DisplayedPick[];
}
