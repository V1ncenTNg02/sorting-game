import { Game, GameItem } from '../domain/Game';

export type GamePatch = Partial<{
  items: GameItem[];
  durationMs: number;
  completed: boolean;
}>;

export interface IGameRepository {
  findAll(): Promise<Game[]>;
  findById(id: string): Promise<Game | null>;
  create(items: GameItem[], durationMs?: number, completed?: boolean): Promise<Game>;
  update(id: string, patch: GamePatch): Promise<Game | null>;
  delete(id: string): Promise<boolean>;
}
