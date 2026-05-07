import { IDatabaseConnection } from '../config/IDatabase';
import { IScoreRepository } from './IScoreRepository';
import { Score } from '../domain/Score';

export class ScoreRepository implements IScoreRepository {
  constructor(private readonly db: IDatabaseConnection) {}

  async getBestScore(): Promise<Score | null> {
    const result = await this.db.query(
      'SELECT id, value, recorded_at FROM scores ORDER BY value ASC LIMIT 1',
    );
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return new Score(row.id, row.value, row.recorded_at);
  }

  async insertScore(value: number): Promise<Score> {
    const result = await this.db.query(
      'INSERT INTO scores (value) VALUES ($1) RETURNING id, value, recorded_at',
      [value],
    );
    const row = result.rows[0];
    return new Score(row.id, row.value, row.recorded_at);
  }
}
