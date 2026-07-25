import { Router } from 'express';
import { RegistroLavadoView } from '../views/RegistroLavadoView';
import { RegistroLavadoService } from '../services/registro_lavado/RegistroLavadoService';
import { RegistroLavadoRepository } from '../repository/registro_lavado_repository';
import { db } from '../config/firebase';
import { authMiddleware } from '../middlewares/auth_middleware';
import { requireAdmin } from '../middlewares/role_middleware';

const router = Router();
const repository = new RegistroLavadoRepository(db);
const service = new RegistroLavadoService(repository);
const view = new RegistroLavadoView(service);

router.get('/', authMiddleware, view.obtenerRegistros);
router.get('/:id', authMiddleware, view.obtenerRegistro);
router.post('/', authMiddleware, view.crearRegistro);
router.put('/:id', authMiddleware, view.editarRegistro);
router.delete('/:id', authMiddleware, requireAdmin, view.eliminarRegistro);

export default router;
