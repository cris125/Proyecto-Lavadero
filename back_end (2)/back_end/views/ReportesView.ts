import { Request, Response, NextFunction } from 'express';
import { ReportesService } from '../services/reportes/ReportesService';

export class ReportesView {
  constructor(private reportesService: ReportesService) {}

  ventas = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { desde, hasta, agrupacion } = req.query;
      const data = await this.reportesService.ventasPorPeriodo(
        Number(desde), Number(hasta),
        (agrupacion as 'dia' | 'semana' | 'mes') || 'dia'
      );
      res.json(data);
    } catch (error) {
      next(error);
    }
  };

  serviciosMasVendidos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { desde, hasta } = req.query;
      const data = await this.reportesService.serviciosMasVendidos(Number(desde), Number(hasta));
      res.json(data);
    } catch (error) {
      next(error);
    }
  };

  colaboradores = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { desde, hasta } = req.query;
      const data = await this.reportesService.colaboradoresProductividad(Number(desde), Number(hasta));
      res.json(data);
    } catch (error) {
      next(error);
    }
  };

  clientesFrecuentes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { desde, hasta } = req.query;
      const data = await this.reportesService.clientesFrecuentes(Number(desde), Number(hasta));
      res.json(data);
    } catch (error) {
      next(error);
    }
  };

  utilidad = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { desde, hasta } = req.query;
      const data = await this.reportesService.utilidad(Number(desde), Number(hasta));
      res.json(data);
    } catch (error) {
      next(error);
    }
  };
}
