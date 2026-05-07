import 'dotenv/config';
import express, { Express } from 'express';
import cors from 'cors';
import healthRouter from './routes/health';

class Application {
  private readonly app: Express;

  constructor() {
    this.app = express();
    this.configureMiddleware();
    this.configureRoutes();
  }

  private configureMiddleware(): void {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private configureRoutes(): void {
    this.app.use('/health', healthRouter);
  }

  start(port: number | string): void {
    this.app.listen(port, () => {
      console.log(`Backend running on port ${port}`);
    });
  }
}

const application = new Application();
application.start(process.env.PORT ?? 3000);
