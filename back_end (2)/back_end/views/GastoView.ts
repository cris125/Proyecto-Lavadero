import { Request, Response, NextFunction } from 'express';
import { GastoService } from '../services/gasto/GastoService';

export class GastoView {
  constructor(private gastoService: GastoService) {}

  crearGasto = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { concepto, monto, categoria, fecha } = req.body;
      const result = await this.gastoService.crearGasto({ concepto, monto, categoria, fecha });
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  obtenerGasto = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const gasto = await this.gastoService.obtenerGasto(id);
      res.json(gasto);
    } catch (error) {
      next(error);
    }
  };

  obtenerGastos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { desde, hasta } = req.query;
      if (desde && hasta) {
        const gastos = await this.gastoService.obtenerGastosPorFecha(Number(desde), Number(hasta));
        res.json(gastos);
        return;
      }
      const gastos = await this.gastoService.obtenerGastos();
      res.json(gastos);
    } catch (error) {
      next(error);
    }
  };

  editarGasto = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      await this.gastoService.editarGasto(id, req.body);
      res.json({ message: 'Gasto actualizado correctamente' });
    } catch (error) {
      next(error);
    }
  };

  eliminarGasto = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      await this.gastoService.eliminarGasto(id);
      res.json({ message: 'Gasto eliminado correctamente' });
    } catch (error) {
      next(error);
    }
  };
}
