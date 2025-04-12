export interface UserModel {
  id: number,
  username: string,
  nickname: string,
  email: string,
  passwordHash: string,
  pfp_path: string
}


export interface Game {
  id: number,
  name: string
}

export interface Scores {
  id: number
  user_id: number
  game_id: number
  points: number
  timestamp: string
}