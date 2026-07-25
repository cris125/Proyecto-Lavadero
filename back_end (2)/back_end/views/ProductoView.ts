import { Request, Response, NextFunction } from 'express';
import { ProductoService } from '../services/producto/ProductoService';

export class ProductoView {
  constructor(private productoService: ProductoService) {}

  crearProducto = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { nombre, descripcion, precio_compra, precio_venta, cantidad, unidad } = req.body;
      const result = await this.productoService.crearProducto({ nombre, descripcion, precio_compra, precio_venta, cantidad, unidad });
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  obtenerProducto = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const producto = await this.productoService.obtenerProducto(id);
      res.json(producto);
    } catch (error) {
      next(error);
    }
  };

  obtenerProductos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productos = await this.productoService.obtenerProductos();
      res.json(productos);
    } catch (error) {
      next(error);
    }
  };

  editarProducto = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      await this.productoService.editarProducto(id, req.body);
      res.json({ message: 'Producto actualizado correctamente' });
    } catch (error) {
      next(error);
    }
  };

  eliminarProducto = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      await this.productoService.eliminarProducto(id);
      res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
      next(error);
    }
  };
}
