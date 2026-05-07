import request from 'supertest';
import express from 'express';
import { IScoreService, SubmitScoreResult } from '../services/IScoreService';
import { Score } from '../domain/Score';
import { createScoresRouter } from '../routes/scores';

function makeMockScoreService(overrides: Partial<IScoreService> = {}): IScoreService {
  return {
    getBestScore: jest.fn().mockResolvedValue(null),
    submitScore: jest.fn().mockResolvedValue({ accepted: true, score: new Score(1, 5000, new Date()) }),
    ...overrides,
  };
}

function makeApp(service: IScoreService) {
  const app = express();
  app.use(express.json());
  app.use('/api/best-score', createScoresRouter(service));
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(500).json({ error: err.message });
  });
  return app;
}

describe('GET /api/best-score', () => {
  it('returns 404 when no score exists', async () => {
    const app = makeApp(makeMockScoreService({ getBestScore: jest.fn().mockResolvedValue(null) }));
    const res = await request(app).get('/api/best-score');
    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });

  it('returns 200 with score when one exists', async () => {
    const score = new Score(1, 12000, new Date());
    const app = makeApp(makeMockScoreService({ getBestScore: jest.fn().mockResolvedValue(score) }));
    const res = await request(app).get('/api/best-score');
    expect(res.status).toBe(200);
    expect(res.body.value).toBe(12000);
  });
});

describe('POST /api/best-score', () => {
  it('returns 400 when body is missing value', async () => {
    const app = makeApp(makeMockScoreService());
    const res = await request(app).post('/api/best-score').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });

  it('returns 400 when value is not a positive integer', async () => {
    const app = makeApp(makeMockScoreService());
    const res = await request(app).post('/api/best-score').send({ value: -1 });
    expect(res.status).toBe(400);
  });

  it('returns 400 when value is zero', async () => {
    const app = makeApp(makeMockScoreService());
    const res = await request(app).post('/api/best-score').send({ value: 0 });
    expect(res.status).toBe(400);
  });

  it('returns accepted:true and score when submission is accepted', async () => {
    const score = new Score(1, 5000, new Date());
    const result: SubmitScoreResult = { accepted: true, score };
    const app = makeApp(makeMockScoreService({ submitScore: jest.fn().mockResolvedValue(result) }));
    const res = await request(app).post('/api/best-score').send({ value: 5000 });
    expect(res.status).toBe(200);
    expect(res.body.accepted).toBe(true);
    expect(res.body.score.value).toBe(5000);
  });

  it('returns accepted:false with reason when score is not a new best', async () => {
    const result: SubmitScoreResult = { accepted: false, reason: 'Score is not lower than the current best' };
    const app = makeApp(makeMockScoreService({ submitScore: jest.fn().mockResolvedValue(result) }));
    const res = await request(app).post('/api/best-score').send({ value: 99999 });
    expect(res.status).toBe(200);
    expect(res.body.accepted).toBe(false);
    expect(res.body.reason).toBeDefined();
  });
});

describe('ScoreService business rule (unit)', () => {
  it('accepts score when no existing best', async () => {
    const { ScoreService } = await import('../services/ScoreService');
    const mockRepo = {
      getBestScore: jest.fn().mockResolvedValue(null),
      insertScore: jest.fn().mockResolvedValue(new Score(1, 3000, new Date())),
    };
    const service = new ScoreService(mockRepo);
    const result = await service.submitScore(3000);
    expect(result.accepted).toBe(true);
    expect(mockRepo.insertScore).toHaveBeenCalledWith(3000);
  });

  it('accepts score when new value is lower than current best', async () => {
    const { ScoreService } = await import('../services/ScoreService');
    const mockRepo = {
      getBestScore: jest.fn().mockResolvedValue(new Score(1, 10000, new Date())),
      insertScore: jest.fn().mockResolvedValue(new Score(2, 5000, new Date())),
    };
    const service = new ScoreService(mockRepo);
    const result = await service.submitScore(5000);
    expect(result.accepted).toBe(true);
    expect(mockRepo.insertScore).toHaveBeenCalledWith(5000);
  });

  it('rejects score when new value equals the current best', async () => {
    const { ScoreService } = await import('../services/ScoreService');
    const mockRepo = {
      getBestScore: jest.fn().mockResolvedValue(new Score(1, 5000, new Date())),
      insertScore: jest.fn(),
    };
    const service = new ScoreService(mockRepo);
    const result = await service.submitScore(5000);
    expect(result.accepted).toBe(false);
    expect(mockRepo.insertScore).not.toHaveBeenCalled();
  });

  it('rejects score when new value is higher than current best', async () => {
    const { ScoreService } = await import('../services/ScoreService');
    const mockRepo = {
      getBestScore: jest.fn().mockResolvedValue(new Score(1, 5000, new Date())),
      insertScore: jest.fn(),
    };
    const service = new ScoreService(mockRepo);
    const result = await service.submitScore(9999);
    expect(result.accepted).toBe(false);
    expect(mockRepo.insertScore).not.toHaveBeenCalled();
  });
});
