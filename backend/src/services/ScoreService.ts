import { IScoreRepository } from '../repositories/IScoreRepository';
import { IScoreService, SubmitScoreResult } from './IScoreService';
import { Score } from '../domain/Score';

export class ScoreService implements IScoreService {
  constructor(private readonly scoreRepository: IScoreRepository) {}

  getBestScore(): Promise<Score | null> {
    return this.scoreRepository.getBestScore();
  }

  async submitScore(value: number): Promise<SubmitScoreResult> {
    const current = await this.scoreRepository.getBestScore();
    if (current === null || value < current.value) {
      const score = await this.scoreRepository.insertScore(value);
      return { accepted: true, score };
    }
    return { accepted: false, reason: 'Score is not lower than the current best' };
  }
}
