import { Request, Response } from 'express';
import { IDatabaseConnection } from '../config/IDatabase';

export class HealthController {
  constructor(private readonly db: IDatabaseConnection) {}

  async check(req: Request, res: Response): Promise<void> {
    const dbAlive = await this.db.healthCheck();
    if (!dbAlive) {
      res.status(500).send('Service unavailable');
      return;
    }
    res.status(200).send('OK');
  }
}
