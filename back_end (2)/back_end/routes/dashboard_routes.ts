import { Router } from 'express';
import { DashboardView } from '../views/DashboardView';
import { DashboardService } from '../services/dashboard/DashboardService';
import { RegistroLavadoRepository } from '../repository/registro_lavado_repository';
import { GastoRepository } from '../repository/gasto_repository';
import { ClienteRepository } from '../repository/cliente_repository';
import { db } from '../config/firebase';
import { authMiddleware } from '../middlewares/auth_middleware';
import { requireAdmin } from '../middlewares/role_middleware';

const router = Router();
const registroRepo = new RegistroLavadoRepository(db);
const gastoRepo = new GastoRepository(db);
const clienteRepo = new ClienteRepository(db);
const service = new DashboardService(registroRepo, gastoRepo, clienteRepo);
const view = new DashboardView(service);

router.get('/hoy', authMiddleware, requireAdmin, view.hoy);
router.get('/semana', authMiddleware, requireAdmin, view.semana);
router.get('/mes', authMiddleware, requireAdmin, view.mes);

export default router;
