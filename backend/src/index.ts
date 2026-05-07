import 'dotenv/config';
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { DatabaseConnection } from './config/database';
import { createHealthRouter } from './routes/health';
import { createScoresRouter } from './routes/scores';
import { createGamesRouter } from './routes/games';
import { ScoreRepository } from './repositories/ScoreRepository';
import { GameRepository } from './repositories/GameRepository';
import { ScoreService } from './services/ScoreService';
import { GameService } from './services/GameService';

class Application {
  private readonly app: Express;

  constructor() {
    this.app = express();
    this.configureMiddleware();
    this.configureRoutes();
    this.configureErrorHandling();
  }

  private configureMiddleware(): void {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private configureRoutes(): void {
    const db = DatabaseConnection.getInstance();
    const scoreService = new ScoreService(new ScoreRepository(db));
    const gameService = new GameService(new GameRepository(db));

    this.app.use('/health', createHealthRouter(db));
    this.app.use('/api/best-score', createScoresRouter(scoreService));
    this.app.use('/api/games', createGamesRouter(gameService));
  }

  private configureErrorHandling(): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      console.error(err.message);
      res.status(500).json({ error: 'Internal server error' });
    });
  }

  start(port: number | string): void {
    this.app.listen(port, () => {
      console.log(`Backend running on port ${port}`);
    });
  }
}

const application = new Application();
application.start(process.env.PORT ?? 3000);
