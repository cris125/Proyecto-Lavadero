import { ProductoRepository } from '../../repository/producto_repository';
import { Producto } from '../../models/Producto';
import { validarEntrada } from '../../utils/validators';
import { NotFoundError } from '../../excepciones/NotFoundError';
import { ValidationError } from '../../excepciones/ValidationError';

export class ProductoService {
  constructor(private productoRepo: ProductoRepository) {}

  async crearProducto(data: {
    nombre: string;
    descripcion: string;
    precio_compra: number;
    precio_venta: number;
    cantidad: number;
    unidad: string;
  }): Promise<{ id: string }> {
    if (!data.nombre) {
      throw new ValidationError('El nombre del producto es obligatorio');
    }
    if (data.precio_compra < 0 || data.precio_venta < 0) {
      throw new ValidationError('Los precios no pueden ser negativos');
    }
    if (data.cantidad < 0) {
      throw new ValidationError('La cantidad no puede ser negativa');
    }
    if (!validarEntrada(data.nombre)) {
      throw new ValidationError('El nombre contiene caracteres no permitidos');
    }

    const now = Date.now();
    const id = `prod_${now}_${Math.random().toString(36).substring(2, 8)}`;
    const producto: Producto = {
      id,
      nombre: data.nombre,
      descripcion: data.descripcion || '',
      precio_compra: data.precio_compra,
      precio_venta: data.precio_venta,
      cantidad: data.cantidad,
      unidad: data.unidad,
      estado: data.cantidad > 0 ? 'disponible' : 'agotado',
      createdAt: now,
      updatedAt: now,
    };

    await this.productoRepo.agregar_registro(id, producto);
    return { id };
  }

  async obtenerProducto(id: string): Promise<Producto> {
    const producto = await this.productoRepo.obtener_registro(id);
    if (!producto) {
      throw new NotFoundError('Producto no encontrado');
    }
    return producto;
  }

  async obtenerProductos(): Promise<Producto[]> {
    return this.productoRepo.obtener_registros();
  }

  async editarProducto(id: string, data: Partial<Producto>): Promise<void> {
    const existente = await this.productoRepo.obtener_registro(id);
    if (!existente) {
      throw new NotFoundError('Producto no encontrado');
    }
    if (data.precio_compra != null && data.precio_compra < 0) {
      throw new ValidationError('El precio de compra no puede ser negativo');
    }
    if (data.precio_venta != null && data.precio_venta < 0) {
      throw new ValidationError('El precio de venta no puede ser negativo');
    }
    if (data.cantidad != null) {
      if (data.cantidad < 0) throw new ValidationError('La cantidad no puede ser negativa');
      if (data.cantidad === 0) data.estado = 'agotado';
      else data.estado = 'disponible';
    }
    data.updatedAt = Date.now();
    await this.productoRepo.modificar_registro(id, data);
  }

  async eliminarProducto(id: string): Promise<void> {
    const existente = await this.productoRepo.obtener_registro(id);
    if (!existente) {
      throw new NotFoundError('Producto no encontrado');
    }
    await this.productoRepo.eliminar_registro(id);
  }

  async actualizarStock(id: string, cantidad: number): Promise<void> {
    const producto = await this.productoRepo.obtener_registro(id);
    if (!producto) {
      throw new NotFoundError('Producto no encontrado');
    }
    const nuevoStock = producto.cantidad + cantidad;
    if (nuevoStock < 0) {
      throw new ValidationError('Stock insuficiente');
    }
    await this.productoRepo.modificar_registro(id, {
      cantidad: nuevoStock,
      estado: nuevoStock > 0 ? 'disponible' : 'agotado',
      updatedAt: Date.now(),
    });
  }
}
