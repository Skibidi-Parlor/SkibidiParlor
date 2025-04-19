export interface UserModel {
  id: number;
  username: string;
  nickname: string;
  email: string;
  passwordHash: string;
  pfp_path: string;

  // Two star
  cheesePizza: number;
  pizzaDough: number;
  mozzerellaPizza: number;
  sauceOnlyPizza: number;

  // Three star
  onionPizza: number;
  pepperoniPizza: number;
  sausagePizza: number;
  mushroomPizza: number;
  bellPepperPizza: number;
  olivePizza: number;

  // Four star
  meatLovers: number;
  hawaiian: number;
  magarita: number;
  veggie: number;
  vegan: number;
  discontinuedCostcoCombinationPizza: number;

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
