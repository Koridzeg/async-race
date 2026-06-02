export interface Winner {
  id: number;
  wins: number;
  time: number;
}

export type WinnerSortField = 'id' | 'wins' | 'time';
export type SortOrder = 'ASC' | 'DESC';

export interface WinnerView extends Winner {
  name: string;
  color: string;
}