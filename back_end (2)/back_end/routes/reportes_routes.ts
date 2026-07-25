import { Router } from 'express';
import { ReportesView } from '../views/ReportesView';
import { ReportesService } from '../services/reportes/ReportesService';
import { RegistroLavadoRepository } from '../repository/registro_lavado_repository';
import { GastoRepository } from '../repository/gasto_repository';
import { db } from '../config/firebase';
import { authMiddleware } from '../middlewares/auth_middleware';
import { requireAdmin } from '../middlewares/role_middleware';

const router = Router();
const registroRepo = new RegistroLavadoRepository(db);
const gastoRepo = new GastoRepository(db);
const service = new ReportesService(registroRepo, gastoRepo);
const view = new ReportesView(service);

router.get('/ventas', authMiddleware, requireAdmin, view.ventas);
router.get('/servicios-mas-vendidos', authMiddleware, requireAdmin, view.serviciosMasVendidos);
router.get('/colaboradores', authMiddleware, requireAdmin, view.colaboradores);
router.get('/clientes-frecuentes', authMiddleware, requireAdmin, view.clientesFrecuentes);
router.get('/utilidad', authMiddleware, requireAdmin, view.utilidad);

export default router;
