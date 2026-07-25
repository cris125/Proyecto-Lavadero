import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboard/DashboardService';

export class DashboardView {
  constructor(private dashboardService: DashboardService) {}

  hoy = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.dashboardService.obtenerDashboardHoy();
      res.json(data);
    } catch (error) {
      next(error);
    }
  };

  semana = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.dashboardService.obtenerDashboardSemana();
      res.json(data);
    } catch (error) {
      next(error);
    }
  };

  mes = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.dashboardService.obtenerDashboardMes();
      res.json(data);
    } catch (error) {
      next(error);
    }
  };
}
