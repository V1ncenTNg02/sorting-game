import { Router } from 'express';
import { DatabaseConnection } from '../config/database';
import { HealthController } from '../controllers/HealthController';

const router = Router();
const controller = new HealthController(DatabaseConnection.getInstance());

router.get('/', (req, res) => controller.check(req, res));

export default router;
