import { Router } from 'express';
import { IGameService } from '../services/IGameService';
import { GameController } from '../controllers/GameController';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/asyncHandler';
import { PostGameSchema, PatchGameSchema } from '../validation/gameSchemas';

export function createGamesRouter(gameService: IGameService): Router {
  const router = Router();
  const controller = new GameController(gameService);

  router.get('/', asyncHandler((req, res) => controller.getAllGames(req, res)));
  router.post(
    '/',
    validate(PostGameSchema),
    asyncHandler((req, res) => controller.createGame(req, res)),
  );
  router.get('/:id', asyncHandler((req, res) => controller.getGame(req, res)));
  router.patch(
    '/:id',
    validate(PatchGameSchema),
    asyncHandler((req, res) => controller.updateGame(req, res)),
  );
  router.delete('/:id', asyncHandler((req, res) => controller.deleteGame(req, res)));

  return router;
}
