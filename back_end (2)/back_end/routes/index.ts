import { Router } from 'express';
import usuarioRoutes from './usuario_routes';
import productoRoutes from './producto_routes';
import servicioRoutes from './servicio_routes';
import clienteRoutes from './cliente_routes';
import vehiculoRoutes from './vehiculo_routes';
import registroLavadoRoutes from './registro_lavado_routes';
import gastoRoutes from './gasto_routes';
import dashboardRoutes from './dashboard_routes';
import reportesRoutes from './reportes_routes';

const router = Router();

router.use('/usuarios', usuarioRoutes);
router.use('/productos', productoRoutes);
router.use('/servicios', servicioRoutes);
router.use('/clientes', clienteRoutes);
router.use('/vehiculos', vehiculoRoutes);
router.use('/lavados', registroLavadoRoutes);
router.use('/gastos', gastoRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/reportes', reportesRoutes);

export default router;
