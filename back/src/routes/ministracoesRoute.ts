import { Router } from 'express';
import ministracoesController from '../controllers/ministracoesController';

const router = Router();

router.post('/add-ministracao', ministracoesController.addGasto)

export default router;