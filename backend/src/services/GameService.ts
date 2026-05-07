import { IGameRepository, GamePatch } from '../repositories/IGameRepository';
import { IGameService } from './IGameService';
import { Game, GameItem } from '../domain/Game';

export class GameService implements IGameService {
  constructor(private readonly gameRepository: IGameRepository) {}

  getAllGames(): Promise<Game[]> {
    return this.gameRepository.findAll();
  }

  getGame(id: string): Promise<Game | null> {
    return this.gameRepository.findById(id);
  }

  createGame(items: GameItem[], durationMs?: number, completed?: boolean): Promise<Game> {
    return this.gameRepository.create(items, durationMs, completed);
  }

  updateGame(id: string, patch: GamePatch): Promise<Game | null> {
    return this.gameRepository.update(id, patch);
  }

  deleteGame(id: string): Promise<boolean> {
    return this.gameRepository.delete(id);
  }
}
