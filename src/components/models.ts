import { User, Pick } from 'src/api';

export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}

export interface DisplayedUserInfo extends User {
  picks: Pick[];
}
