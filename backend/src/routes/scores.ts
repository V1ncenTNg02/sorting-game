import { Router } from 'express';
import { IScoreService } from '../services/IScoreService';
import { ScoreController } from '../controllers/ScoreController';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/asyncHandler';
import { PostScoreSchema } from '../validation/scoreSchemas';

export function createScoresRouter(scoreService: IScoreService): Router {
  const router = Router();
  const controller = new ScoreController(scoreService);

  router.get('/', asyncHandler((req, res) => controller.getBestScore(req, res)));
  router.post(
    '/',
    validate(PostScoreSchema),
    asyncHandler((req, res) => controller.submitScore(req, res)),
  );

  return router;
}
