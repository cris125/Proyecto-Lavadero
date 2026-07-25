import { Router } from 'express';
import { ClienteView } from '../views/ClienteView';
import { ClienteService } from '../services/cliente/ClienteService';
import { ClienteRepository } from '../repository/cliente_repository';
import { db } from '../config/firebase';
import { authMiddleware } from '../middlewares/auth_middleware';
import { requireAdmin } from '../middlewares/role_middleware';

const router = Router();
const repository = new ClienteRepository(db);
const service = new ClienteService(repository);
const view = new ClienteView(service);

router.get('/', authMiddleware, view.obtenerClientes);
router.get('/buscar', authMiddleware, view.buscarPorTelefono);
router.get('/:id', authMiddleware, view.obtenerCliente);
router.post('/', authMiddleware, view.crearCliente);
router.put('/:id', authMiddleware, view.editarCliente);
router.delete('/:id', authMiddleware, requireAdmin, view.eliminarCliente);

export default router;
