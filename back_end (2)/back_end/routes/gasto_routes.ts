import { Router } from 'express';
import { GastoView } from '../views/GastoView';
import { GastoService } from '../services/gasto/GastoService';
import { GastoRepository } from '../repository/gasto_repository';
import { db } from '../config/firebase';
import { authMiddleware } from '../middlewares/auth_middleware';
import { requireAdmin } from '../middlewares/role_middleware';

const router = Router();
const repository = new GastoRepository(db);
const service = new GastoService(repository);
const view = new GastoView(service);

router.get('/', authMiddleware, requireAdmin, view.obtenerGastos);
router.get('/:id', authMiddleware, requireAdmin, view.obtenerGasto);
router.post('/', authMiddleware, requireAdmin, view.crearGasto);
router.put('/:id', authMiddleware, requireAdmin, view.editarGasto);
router.delete('/:id', authMiddleware, requireAdmin, view.eliminarGasto);

export default router;
