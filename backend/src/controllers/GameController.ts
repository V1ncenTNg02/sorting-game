import { Request, Response } from 'express';
import { IGameService } from '../services/IGameService';
import { GamePatch } from '../repositories/IGameRepository';
import { GameItem } from '../domain/Game';

export class GameController {
  constructor(private readonly gameService: IGameService) {}

  async getAllGames(req: Request, res: Response): Promise<void> {
    const games = await this.gameService.getAllGames();
    res.json(games);
  }

  async getGame(req: Request, res: Response): Promise<void> {
    const game = await this.gameService.getGame(req.params['id'] as string);
    if (game === null) {
      res.status(404).json({ error: 'Game not found' });
      return;
    }
    res.json(game);
  }

  async createGame(req: Request, res: Response): Promise<void> {
    const { items, duration_ms, completed } = req.body as {
      items: GameItem[];
      duration_ms?: number;
      completed?: boolean;
    };
    const game = await this.gameService.createGame(items, duration_ms, completed);
    res.status(201).json(game);
  }

  async updateGame(req: Request, res: Response): Promise<void> {
    const patch: GamePatch = {};
    const body = req.body as { items?: GameItem[]; duration_ms?: number; completed?: boolean };
    if (body.items !== undefined) patch.items = body.items;
    if (body.duration_ms !== undefined) patch.durationMs = body.duration_ms;
    if (body.completed !== undefined) patch.completed = body.completed;

    const game = await this.gameService.updateGame(req.params['id'] as string, patch);
    if (game === null) {
      res.status(404).json({ error: 'Game not found' });
      return;
    }
    res.json(game);
  }

  async deleteGame(req: Request, res: Response): Promise<void> {
    const deleted = await this.gameService.deleteGame(req.params['id'] as string);
    if (!deleted) {
      res.status(404).json({ error: 'Game not found' });
      return;
    }
    res.status(204).send();
  }
}
