import { IDatabaseConnection } from '../config/IDatabase';
import { IGameRepository, GamePatch } from './IGameRepository';
import { Game, GameItem } from '../domain/Game';

export class GameRepository implements IGameRepository {
  constructor(private readonly db: IDatabaseConnection) {}

  private rowToGame(row: Record<string, unknown>): Game {
    return new Game(
      row.id as string,
      row.items as GameItem[],
      row.duration_ms as number | null,
      row.completed as boolean,
      row.created_at as Date,
      row.updated_at as Date,
    );
  }

  async findAll(): Promise<Game[]> {
    const result = await this.db.query(
      'SELECT id, items, duration_ms, completed, created_at, updated_at FROM games ORDER BY created_at DESC',
    );
    return result.rows.map((row) => this.rowToGame(row));
  }

  async findById(id: string): Promise<Game | null> {
    const result = await this.db.query(
      'SELECT id, items, duration_ms, completed, created_at, updated_at FROM games WHERE id = $1',
      [id],
    );
    if (result.rows.length === 0) return null;
    return this.rowToGame(result.rows[0]);
  }

  async create(items: GameItem[], durationMs?: number, completed?: boolean): Promise<Game> {
    const result = await this.db.query(
      `INSERT INTO games (items, duration_ms, completed)
       VALUES ($1, $2, $3)
       RETURNING id, items, duration_ms, completed, created_at, updated_at`,
      [JSON.stringify(items), durationMs ?? null, completed ?? false],
    );
    return this.rowToGame(result.rows[0]);
  }

  private buildUpdateSets(patch: GamePatch): { sets: string[]; values: unknown[] } {
    const sets: string[] = [];
    const values: unknown[] = [];
    if (patch.items !== undefined) {
      sets.push(`items = $${values.length + 1}`);
      values.push(JSON.stringify(patch.items));
    }
    if (patch.durationMs !== undefined) {
      sets.push(`duration_ms = $${values.length + 1}`);
      values.push(patch.durationMs);
    }
    if (patch.completed !== undefined) {
      sets.push(`completed = $${values.length + 1}`);
      values.push(patch.completed);
    }
    return { sets, values };
  }

  async update(id: string, patch: GamePatch): Promise<Game | null> {
    const { sets, values } = this.buildUpdateSets(patch);
    if (sets.length === 0) return this.findById(id);
    sets.push('updated_at = NOW()');
    values.push(id);
    const result = await this.db.query(
      `UPDATE games SET ${sets.join(', ')} WHERE id = $${values.length}
       RETURNING id, items, duration_ms, completed, created_at, updated_at`,
      values,
    );
    if (result.rows.length === 0) return null;
    return this.rowToGame(result.rows[0]);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db.query('DELETE FROM games WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
