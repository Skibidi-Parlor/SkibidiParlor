export interface UserModel {
  id: number;
  username: string;
  nickname: string;
  email: string;
  passwordHash: string;
  pfp_path: string;
}

export interface QuestionModel {
  question: string;
  A: string;
  B: string;
  C: string;
  D: string;
  answer: string;
}

export interface LeaderboardModel {
  [key: string]: number | string;
}

export interface LeaderboardEntryModel {
  id: number;
  username: string;
  pfp_path: string;
  total_points: number;
}

export interface LeaderboardTestModel {
  user_id: number;
  username: string;
  nickname: string;
  pfp_path: string;
  total_points: number;
}

export interface Game {
  id: number;
  name: string;
}

export interface Scores {
  id: number;
  user_id: number;
  game_id: number;
  points: number;
  timestamp: string;
}
