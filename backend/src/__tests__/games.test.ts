import request from 'supertest';
import express from 'express';
import { IGameService } from '../services/IGameService';
import { Game } from '../domain/Game';
import { createGamesRouter } from '../routes/games';

const SAMPLE_ITEMS = [{ id: '1', shape: 'triangle' as const, colour: 'red' as const }];

function makeSampleGame(): Game {
  return new Game('uuid-1', SAMPLE_ITEMS, null, false, new Date('2024-01-01'), new Date('2024-01-01'));
}

function makeMockGameService(overrides: Partial<IGameService> = {}): IGameService {
  return {
    getAllGames: jest.fn().mockResolvedValue([]),
    getGame: jest.fn().mockResolvedValue(null),
    createGame: jest.fn().mockResolvedValue(makeSampleGame()),
    updateGame: jest.fn().mockResolvedValue(makeSampleGame()),
    deleteGame: jest.fn().mockResolvedValue(false),
    ...overrides,
  };
}

function makeApp(service: IGameService) {
  const app = express();
  app.use(express.json());
  app.use('/api/games', createGamesRouter(service));
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(500).json({ error: err.message });
  });
  return app;
}

describe('GET /api/games', () => {
  it('returns 200 with empty array when no games', async () => {
    const app = makeApp(makeMockGameService());
    const res = await request(app).get('/api/games');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns 200 with games list', async () => {
    const game = makeSampleGame();
    const app = makeApp(makeMockGameService({ getAllGames: jest.fn().mockResolvedValue([game]) }));
    const res = await request(app).get('/api/games');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });
});

describe('POST /api/games', () => {
  it('returns 201 with created game on valid body', async () => {
    const app = makeApp(makeMockGameService());
    const res = await request(app)
      .post('/api/games')
      .send({ items: SAMPLE_ITEMS });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
  });

  it('returns 400 when items is missing', async () => {
    const app = makeApp(makeMockGameService());
    const res = await request(app).post('/api/games').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });

  it('returns 400 when items is empty array', async () => {
    const app = makeApp(makeMockGameService());
    const res = await request(app).post('/api/games').send({ items: [] });
    expect(res.status).toBe(400);
  });

  it('returns 400 when item has invalid shape', async () => {
    const app = makeApp(makeMockGameService());
    const res = await request(app)
      .post('/api/games')
      .send({ items: [{ id: '1', shape: 'hexagon', colour: 'red' }] });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/games/:id', () => {
  it('returns 200 with game when found', async () => {
    const game = makeSampleGame();
    const app = makeApp(makeMockGameService({ getGame: jest.fn().mockResolvedValue(game) }));
    const res = await request(app).get('/api/games/uuid-1');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('uuid-1');
  });

  it('returns 404 when game not found', async () => {
    const app = makeApp(makeMockGameService({ getGame: jest.fn().mockResolvedValue(null) }));
    const res = await request(app).get('/api/games/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Game not found');
  });
});

describe('PATCH /api/games/:id', () => {
  it('returns 200 with updated game', async () => {
    const updated = new Game('uuid-1', SAMPLE_ITEMS, 8000, true, new Date(), new Date());
    const app = makeApp(makeMockGameService({ updateGame: jest.fn().mockResolvedValue(updated) }));
    const res = await request(app)
      .patch('/api/games/uuid-1')
      .send({ completed: true, duration_ms: 8000 });
    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(true);
  });

  it('returns 404 when game not found', async () => {
    const app = makeApp(makeMockGameService({ updateGame: jest.fn().mockResolvedValue(null) }));
    const res = await request(app).patch('/api/games/nonexistent').send({ completed: true });
    expect(res.status).toBe(404);
  });

  it('returns 400 when patch body has invalid shape value', async () => {
    const app = makeApp(makeMockGameService());
    const res = await request(app)
      .patch('/api/games/uuid-1')
      .send({ items: [{ id: '1', shape: 'star', colour: 'red' }] });
    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/games/:id', () => {
  it('returns 204 when game is deleted', async () => {
    const app = makeApp(makeMockGameService({ deleteGame: jest.fn().mockResolvedValue(true) }));
    const res = await request(app).delete('/api/games/uuid-1');
    expect(res.status).toBe(204);
  });

  it('returns 404 when game not found', async () => {
    const app = makeApp(makeMockGameService({ deleteGame: jest.fn().mockResolvedValue(false) }));
    const res = await request(app).delete('/api/games/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Game not found');
  });
});
