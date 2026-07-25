import { Router } from 'express';
import { UsuarioView } from '../views/UsuarioView';
import { UsuarioService } from '../services/usuario/UsuarioService';
import { UsuarioRepository } from '../repository/usuario_repository';
import { db } from '../config/firebase';
import { authMiddleware } from '../middlewares/auth_middleware';
import { requireAdmin } from '../middlewares/role_middleware';

const router = Router();
const repository = new UsuarioRepository(db);
const service = new UsuarioService(repository);
const view = new UsuarioView(service);

router.post('/register', view.registrar);
router.post('/login', view.login);
router.get('/', authMiddleware, requireAdmin, view.obtenerUsuarios);
router.get('/:id', authMiddleware, requireAdmin, view.obtenerUsuario);
router.post('/', authMiddleware, requireAdmin, view.crearUsuario);
router.put('/:id', authMiddleware, requireAdmin, view.editarUsuario);
router.delete('/:id', authMiddleware, requireAdmin, view.eliminarUsuario);
router.patch('/:id/restablecer-password', authMiddleware, requireAdmin, view.restablecerPassword);
router.put('/perfil', authMiddleware, view.actualizarPerfil);
router.put('/cambiar-password', authMiddleware, view.cambiarPassword);

export default router;
