import { Score } from '../domain/Score';

export type SubmitScoreResult =
  | { accepted: true; score: Score }
  | { accepted: false; reason: string };

export interface IScoreService {
  getBestScore(): Promise<Score | null>;
  submitScore(value: number): Promise<SubmitScoreResult>;
}
