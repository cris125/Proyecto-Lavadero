import { Router } from 'express';
import { VehiculoView } from '../views/VehiculoView';
import { VehiculoService } from '../services/vehiculo/VehiculoService';
import { VehiculoRepository } from '../repository/vehiculo_repository';
import { db } from '../config/firebase';
import { authMiddleware } from '../middlewares/auth_middleware';
import { requireAdmin } from '../middlewares/role_middleware';

const router = Router();
const repository = new VehiculoRepository(db);
const service = new VehiculoService(repository);
const view = new VehiculoView(service);

router.get('/', authMiddleware, view.obtenerVehiculos);
router.get('/buscar', authMiddleware, view.buscarPorPlaca);
router.get('/por-propietario', authMiddleware, view.obtenerVehiculosPorPropietario);
router.get('/:id', authMiddleware, view.obtenerVehiculo);
router.post('/', authMiddleware, view.crearVehiculo);
router.put('/:id', authMiddleware, view.editarVehiculo);
router.delete('/:id', authMiddleware, requireAdmin, view.eliminarVehiculo);

export default router;
