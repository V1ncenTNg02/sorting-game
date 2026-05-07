export type GameItem = {
  id: string;
  shape: string;
  colour: string;
  position?: { x: number; y: number };
  bucketId?: string;
};

export class Game {
  constructor(
    public readonly id: string,
    public readonly items: GameItem[],
    public readonly durationMs: number | null,
    public readonly completed: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
