import { Request, Response, NextFunction } from 'express';
import { RegistroLavadoService } from '../services/registro_lavado/RegistroLavadoService';

export class RegistroLavadoView {
  constructor(private registroService: RegistroLavadoService) {}

  crearRegistro = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { cliente_id, vehiculo_id, colaborador_id, servicio_id, precio, observaciones } = req.body;
      const result = await this.registroService.crearRegistro({
        cliente_id, vehiculo_id, colaborador_id, servicio_id, precio, observaciones,
      });
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  obtenerRegistro = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const registro = await this.registroService.obtenerRegistro(id);
      res.json(registro);
    } catch (error) {
      next(error);
    }
  };

  obtenerRegistros = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { desde, hasta, colaborador_id, cliente_id } = req.query;

      if (desde && hasta) {
        const registros = await this.registroService.obtenerRegistrosPorFecha(
          Number(desde), Number(hasta)
        );
        res.json(registros);
        return;
      }
      if (colaborador_id) {
        const registros = await this.registroService.obtenerRegistrosPorColaborador(colaborador_id as string);
        res.json(registros);
        return;
      }
      if (cliente_id) {
        const registros = await this.registroService.obtenerRegistrosPorCliente(cliente_id as string);
        res.json(registros);
        return;
      }

      const registros = await this.registroService.obtenerRegistros();
      res.json(registros);
    } catch (error) {
      next(error);
    }
  };

  editarRegistro = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      await this.registroService.editarRegistro(id, req.body);
      res.json({ message: 'Registro actualizado correctamente' });
    } catch (error) {
      next(error);
    }
  };

  eliminarRegistro = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      await this.registroService.eliminarRegistro(id);
      res.json({ message: 'Registro eliminado correctamente' });
    } catch (error) {
      next(error);
    }
  };
}
