export interface UserModel {
  user_id: number;
  email: string;
  password: string;
  stripe: string;
  isAdmin: boolean;
}

export interface QuestionModel {
  question: string;
  A: string;
  B: string;
  C: string;
  D: string;
  answer: string;
}
