import { Request, Response, NextFunction } from 'express';
import { VehiculoService } from '../services/vehiculo/VehiculoService';

export class VehiculoView {
  constructor(private vehiculoService: VehiculoService) {}

  crearVehiculo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { placa, marca, modelo, color, tipo, propietario_id } = req.body;
      const result = await this.vehiculoService.crearVehiculo({ placa, marca, modelo, color, tipo, propietario_id });
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  obtenerVehiculo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const vehiculo = await this.vehiculoService.obtenerVehiculo(id);
      res.json(vehiculo);
    } catch (error) {
      next(error);
    }
  };

  obtenerVehiculos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const vehiculos = await this.vehiculoService.obtenerVehiculos();
      res.json(vehiculos);
    } catch (error) {
      next(error);
    }
  };

  obtenerVehiculosPorPropietario = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { propietario_id } = req.query;
      const vehiculos = await this.vehiculoService.obtenerVehiculosPorPropietario(propietario_id as string);
      res.json(vehiculos);
    } catch (error) {
      next(error);
    }
  };

  buscarPorPlaca = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { placa } = req.query;
      const vehiculo = await this.vehiculoService.buscarPorPlaca(placa as string);
      res.json(vehiculo);
    } catch (error) {
      next(error);
    }
  };

  editarVehiculo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      await this.vehiculoService.editarVehiculo(id, req.body);
      res.json({ message: 'Vehículo actualizado correctamente' });
    } catch (error) {
      next(error);
    }
  };

  eliminarVehiculo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      await this.vehiculoService.eliminarVehiculo(id);
      res.json({ message: 'Vehículo eliminado correctamente' });
    } catch (error) {
      next(error);
    }
  };
}
