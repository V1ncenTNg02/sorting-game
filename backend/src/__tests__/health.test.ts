import request from 'supertest';
import express from 'express';
import { IDatabaseConnection } from '../config/IDatabase';
import { createHealthRouter } from '../routes/health';

function makeMockDb(healthy: boolean): IDatabaseConnection {
  return {
    query: jest.fn(),
    healthCheck: jest.fn().mockResolvedValue(healthy),
    close: jest.fn(),
  };
}

function makeApp(db: IDatabaseConnection) {
  const app = express();
  app.use('/health', createHealthRouter(db));
  return app;
}

describe('GET /health', () => {
  it('returns 200 with plain text OK when database is healthy', async () => {
    const app = makeApp(makeMockDb(true));
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.text).toBe('OK');
  });

  it('returns 500 when database is unhealthy', async () => {
    const app = makeApp(makeMockDb(false));
    const res = await request(app).get('/health');
    expect(res.status).toBe(500);
  });

  it('returns 500 when healthCheck throws', async () => {
    const db: IDatabaseConnection = {
      query: jest.fn(),
      healthCheck: jest.fn().mockRejectedValue(new Error('connection refused')),
      close: jest.fn(),
    };
    const app = express();
    app.use('/health', createHealthRouter(db));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.status(500).json({ error: err.message });
    });
    const res = await request(app).get('/health');
    expect(res.status).toBe(500);
  });
});
