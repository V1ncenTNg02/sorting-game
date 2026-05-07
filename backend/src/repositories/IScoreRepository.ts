import { Score } from '../domain/Score';

export interface IScoreRepository {
  getBestScore(): Promise<Score | null>;
  insertScore(value: number): Promise<Score>;
}
