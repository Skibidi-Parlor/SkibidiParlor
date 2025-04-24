export interface UserModel {
  id: number;
  username: string;
  nickname: string;
  email: string;
  passwordHash: string;
  pfp_path: string;
  isAdmin: boolean;

  // Two star
  cheesepizza: number;
  pizzadough: number;
  mozzerellapizza: number;
  sauceonlypizza: number;

  // Three star
  onionpizza: number;
  pepperonipizza: number;
  sausagepizza: number;
  mushroompizza: number;
  bellpepperpizza: number;
  olivepizza: number;

  // Four star
  meatlovers: number;
  hawaiian: number;
  magarita: number;
  veggie: number;
  vegan: number;
  discontinuedcostcocombinationpizza: number;

  // Five star
  buffalo: number;
  bbq: number;
  elote: number;
  bubba: number;
  supreme: number;
  blt: number;
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
