import { Request, Response } from 'express';
import { IDatabaseConnection } from '../config/IDatabase';

export class HealthController {
  private db: IDatabaseConnection;

  constructor(db: IDatabaseConnection) {
    this.db = db;
  }

  async check(req: Request, res: Response): Promise<void> {
    const dbAlive = await this.db.healthCheck();

    if (!dbAlive) {
      res.status(500).json({ status: 'error', db: 'unreachable' });
      return;
    }

    res.json({ status: 'ok', db: 'connected' });
  }
}
