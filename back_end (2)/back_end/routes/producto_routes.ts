import { Router } from 'express';
import { ProductoView } from '../views/ProductoView';
import { ProductoService } from '../services/producto/ProductoService';
import { ProductoRepository } from '../repository/producto_repository';
import { db } from '../config/firebase';
import { authMiddleware } from '../middlewares/auth_middleware';
import { requireAdmin } from '../middlewares/role_middleware';

const router = Router();
const repository = new ProductoRepository(db);
const service = new ProductoService(repository);
const view = new ProductoView(service);

router.get('/', authMiddleware, view.obtenerProductos);
router.get('/:id', authMiddleware, view.obtenerProducto);
router.post('/', authMiddleware, requireAdmin, view.crearProducto);
router.put('/:id', authMiddleware, requireAdmin, view.editarProducto);
router.delete('/:id', authMiddleware, requireAdmin, view.eliminarProducto);

export default router;
