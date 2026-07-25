import { Request, Response, NextFunction } from 'express';
import { ClienteService } from '../services/cliente/ClienteService';

export class ClienteView {
  constructor(private clienteService: ClienteService) {}

  crearCliente = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { nombre, telefono, email, observaciones } = req.body;
      const result = await this.clienteService.crearCliente({ nombre, telefono, email, observaciones });
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  obtenerCliente = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const cliente = await this.clienteService.obtenerCliente(id);
      res.json(cliente);
    } catch (error) {
      next(error);
    }
  };

  obtenerClientes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const clientes = await this.clienteService.obtenerClientes();
      res.json(clientes);
    } catch (error) {
      next(error);
    }
  };

  buscarPorTelefono = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { telefono } = req.query;
      const cliente = await this.clienteService.buscarPorTelefono(telefono as string);
      res.json(cliente);
    } catch (error) {
      next(error);
    }
  };

  editarCliente = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      await this.clienteService.editarCliente(id, req.body);
      res.json({ message: 'Cliente actualizado correctamente' });
    } catch (error) {
      next(error);
    }
  };

  eliminarCliente = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      await this.clienteService.eliminarCliente(id);
      res.json({ message: 'Cliente eliminado correctamente' });
    } catch (error) {
      next(error);
    }
  };
}
