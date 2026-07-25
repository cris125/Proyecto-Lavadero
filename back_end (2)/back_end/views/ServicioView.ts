import { Request, Response, NextFunction } from 'express';
import { ServicioService } from '../services/servicio/ServicioService';

export class ServicioView {
  constructor(private servicioService: ServicioService) {}

  crearServicio = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { nombre, descripcion, precio, duracion } = req.body;
      const result = await this.servicioService.crearServicio({ nombre, descripcion, precio, duracion });
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  obtenerServicio = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const servicio = await this.servicioService.obtenerServicio(id);
      res.json(servicio);
    } catch (error) {
      next(error);
    }
  };

  obtenerServicios = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const servicios = await this.servicioService.obtenerServicios();
      res.json(servicios);
    } catch (error) {
      next(error);
    }
  };

  obtenerServiciosActivos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const servicios = await this.servicioService.obtenerServiciosActivos();
      res.json(servicios);
    } catch (error) {
      next(error);
    }
  };

  editarServicio = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      await this.servicioService.editarServicio(id, req.body);
      res.json({ message: 'Servicio actualizado correctamente' });
    } catch (error) {
      next(error);
    }
  };

  eliminarServicio = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      await this.servicioService.eliminarServicio(id);
      res.json({ message: 'Servicio eliminado correctamente' });
    } catch (error) {
      next(error);
    }
  };
}
