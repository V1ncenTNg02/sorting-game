import { Game, GameItem } from '../domain/Game';
import { GamePatch } from '../repositories/IGameRepository';

export interface IGameService {
  getAllGames(): Promise<Game[]>;
  getGame(id: string): Promise<Game | null>;
  createGame(items: GameItem[], durationMs?: number, completed?: boolean): Promise<Game>;
  updateGame(id: string, patch: GamePatch): Promise<Game | null>;
  deleteGame(id: string): Promise<boolean>;
}
