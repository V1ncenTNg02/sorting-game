import { Router } from 'express';
import { IDatabaseConnection } from '../config/IDatabase';
import { HealthController } from '../controllers/HealthController';
import { asyncHandler } from '../middleware/asyncHandler';

export function createHealthRouter(db: IDatabaseConnection): Router {
  const router = Router();
  const controller = new HealthController(db);
  router.get('/', asyncHandler((req, res) => controller.check(req, res)));
  return router;
}
