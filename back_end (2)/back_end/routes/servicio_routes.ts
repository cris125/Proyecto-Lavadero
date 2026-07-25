import { Router } from 'express';
import { ServicioView } from '../views/ServicioView';
import { ServicioService } from '../services/servicio/ServicioService';
import { ServicioRepository } from '../repository/servicio_repository';
import { db } from '../config/firebase';
import { authMiddleware } from '../middlewares/auth_middleware';
import { requireAdmin } from '../middlewares/role_middleware';

const router = Router();
const repository = new ServicioRepository(db);
const service = new ServicioService(repository);
const view = new ServicioView(service);

router.get('/activos', authMiddleware, view.obtenerServiciosActivos);
router.get('/', authMiddleware, view.obtenerServicios);
router.get('/:id', authMiddleware, view.obtenerServicio);
router.post('/', authMiddleware, requireAdmin, view.crearServicio);
router.put('/:id', authMiddleware, requireAdmin, view.editarServicio);
router.delete('/:id', authMiddleware, requireAdmin, view.eliminarServicio);

export default router;
