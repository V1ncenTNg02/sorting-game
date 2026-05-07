import { Request, Response } from 'express';
import { IScoreService } from '../services/IScoreService';

export class ScoreController {
  constructor(private readonly scoreService: IScoreService) {}

  async getBestScore(req: Request, res: Response): Promise<void> {
    const score = await this.scoreService.getBestScore();
    if (score === null) {
      res.status(404).json({ error: 'No score recorded yet' });
      return;
    }
    res.json(score);
  }

  async submitScore(req: Request, res: Response): Promise<void> {
    const { value } = req.body as { value: number };
    const result = await this.scoreService.submitScore(value);
    res.json(result);
  }
}
