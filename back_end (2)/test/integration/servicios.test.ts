import { UsuarioService } from '../../back_end/services/usuario/UsuarioService';
import { ProductoService } from '../../back_end/services/producto/ProductoService';
import { ServicioService } from '../../back_end/services/servicio/ServicioService';
import { ClienteService } from '../../back_end/services/cliente/ClienteService';
import { VehiculoService } from '../../back_end/services/vehiculo/VehiculoService';
import { RegistroLavadoService } from '../../back_end/services/registro_lavado/RegistroLavadoService';
import { GastoService } from '../../back_end/services/gasto/GastoService';
import { UsuarioRepository } from '../../back_end/repository/usuario_repository';
import { ProductoRepository } from '../../back_end/repository/producto_repository';
import { ServicioRepository } from '../../back_end/repository/servicio_repository';
import { ClienteRepository } from '../../back_end/repository/cliente_repository';
import { VehiculoRepository } from '../../back_end/repository/vehiculo_repository';
import { RegistroLavadoRepository } from '../../back_end/repository/registro_lavado_repository';
import { GastoRepository } from '../../back_end/repository/gasto_repository';
import { db } from '../../back_end/config/firebase';
import { limpiarTestIds } from '../helpers/cleanup';
import { ref, remove } from 'firebase/database';

const TEST_SUFFIX = Date.now().toString(36);

let adminId = '';
let colaboradorId = '';
let productoId = '';
let servicioId = '';
let clienteId = '';
let vehiculoId = '';
let lavadoId = '';
let gastoId = '';

const usuarioService = new UsuarioService(new UsuarioRepository(db));
const productoService = new ProductoService(new ProductoRepository(db));
const servicioService = new ServicioService(new ServicioRepository(db));
const clienteService = new ClienteService(new ClienteRepository(db));
const vehiculoService = new VehiculoService(new VehiculoRepository(db));
const registroService = new RegistroLavadoService(new RegistroLavadoRepository(db));
const gastoService = new GastoService(new GastoRepository(db));

async function limpiarTodo() {
  const paths = [
    `usuarios/usr_admin_${TEST_SUFFIX}`,
    `usuarios/usr_colab_${TEST_SUFFIX}`,
    `productos/prod_test_${TEST_SUFFIX}`,
    `servicios/svc_test_${TEST_SUFFIX}`,
    `clientes/cli_test_${TEST_SUFFIX}`,
    `vehiculos/veh_test_${TEST_SUFFIX}`,
    `registros_lavado/lav_test_${TEST_SUFFIX}`,
    `gastos/gas_test_${TEST_SUFFIX}`,
  ];
  for (const path of paths) {
    try { await remove(ref(db, path)); } catch { /* ignore */ }
  }
}

beforeAll(async () => {
  await limpiarTodo();
});

afterAll(async () => {
  await limpiarTodo();
  await limpiarTestIds();
});

describe('01 - UsuarioService', () => {

  test('crearUsuario ADMIN', async () => {
    const result = await usuarioService.crearUsuario('ADMIN', {
      nombre: 'AdminTest',
      apellido: 'Sistema',
      email: `admin_${TEST_SUFFIX}@test.com`,
      telefono: '3001112233',
      contraseña: 'TestPass1@',
      rol: 'ADMIN',
    });
    expect(result.id).toBeDefined();
    adminId = result.id;
  });

  test('crearUsuario COLABORADOR', async () => {
    const result = await usuarioService.crearUsuario('ADMIN', {
      nombre: 'ColabTest',
      apellido: 'Lopez',
      email: `colab_${TEST_SUFFIX}@test.com`,
      telefono: '3011112233',
      contraseña: 'TestPass1@',
      rol: 'COLABORADOR',
    });
    expect(result.id).toBeDefined();
    colaboradorId = result.id;
  });

  test('login correcto', async () => {
    const result = await usuarioService.login(`admin_${TEST_SUFFIX}@test.com`, 'TestPass1@');
    expect(result.usuario).toBeDefined();
    expect(result.token).toBeDefined();
    expect(result.usuario.email).toBe(`admin_${TEST_SUFFIX}@test.com`);
    expect((result.usuario as any).contraseña).toBeUndefined();
  });

  test('login incorrecto lanza error', async () => {
    await expect(
      usuarioService.login(`admin_${TEST_SUFFIX}@test.com`, 'wrongpass')
    ).rejects.toThrow('Usuario o contraseña incorrectos');
  });

  test('obtenerUsuario', async () => {
    const usuario = await usuarioService.obtenerUsuario(adminId);
    expect(usuario.email).toBe(`admin_${TEST_SUFFIX}@test.com`);
    expect((usuario as any).contraseña).toBeUndefined();
  });

  test('obtenerUsuarios', async () => {
    const usuarios = await usuarioService.obtenerUsuarios();
    expect(usuarios.length).toBeGreaterThanOrEqual(2);
  });

  test('editarUsuario', async () => {
    await usuarioService.editarUsuario(colaboradorId, { telefono: '3100000000' });
    const actualizado = await usuarioService.obtenerUsuario(colaboradorId);
    expect(actualizado.telefono).toBe('3100000000');
  });

  test('restablecerPassword', async () => {
    await usuarioService.restablecerPassword(colaboradorId, 'NuevaPass1@');
    const login = await usuarioService.login(`colab_${TEST_SUFFIX}@test.com`, 'NuevaPass1@');
    expect(login.usuario).toBeDefined();
  });

  test('validacion email repetido', async () => {
    await expect(
      usuarioService.crearUsuario('ADMIN', {
        nombre: 'Otro', apellido: 'User',
        email: `admin_${TEST_SUFFIX}@test.com`,
        telefono: '3001112244', contraseña: 'TestPass1@', rol: 'COLABORADOR',
      })
    ).rejects.toThrow('email ya está registrado');
  });
});

describe('02 - ProductoService', () => {

  test('crearProducto', async () => {
    const result = await productoService.crearProducto({
      nombre: `Shampoo ${TEST_SUFFIX}`,
      descripcion: 'Shampoo para lavado',
      precio_compra: 5000,
      precio_venta: 12000,
      cantidad: 50,
      unidad: 'litros',
    });
    expect(result.id).toBeDefined();
    productoId = result.id;
  });

  test('obtenerProducto', async () => {
    const p = await productoService.obtenerProducto(productoId);
    expect(p.nombre).toContain(TEST_SUFFIX);
    expect(p.estado).toBe('disponible');
  });

  test('obtenerProductos', async () => {
    const productos = await productoService.obtenerProductos();
    expect(productos.length).toBeGreaterThanOrEqual(1);
  });

  test('editarProducto', async () => {
    await productoService.editarProducto(productoId, { precio_venta: 15000 });
    const p = await productoService.obtenerProducto(productoId);
    expect(p.precio_venta).toBe(15000);
  });

  test('actualizarStock incrementa', async () => {
    await productoService.actualizarStock(productoId, 10);
    const p = await productoService.obtenerProducto(productoId);
    expect(p.cantidad).toBe(60);
  });

  test('actualizarStock decrementa', async () => {
    await productoService.actualizarStock(productoId, -5);
    const p = await productoService.obtenerProducto(productoId);
    expect(p.cantidad).toBe(55);
  });

  test('actualizarStock insuficiente lanza error', async () => {
    await expect(
      productoService.actualizarStock(productoId, -1000)
    ).rejects.toThrow('Stock insuficiente');
  });

  test('validacion precio negativo', async () => {
    await expect(
      productoService.crearProducto({
        nombre: 'Test', descripcion: '', precio_compra: -1, precio_venta: 10,
        cantidad: 1, unidad: 'unidad',
      })
    ).rejects.toThrow('negativo');
  });
});

describe('03 - ServicioService (Catálogo)', () => {

  test('crearServicio', async () => {
    const result = await servicioService.crearServicio({
      nombre: `Lavado Básico ${TEST_SUFFIX}`,
      descripcion: 'Lavado exterior e interior',
      precio: 25000,
      duracion: 30,
    });
    expect(result.id).toBeDefined();
    servicioId = result.id;
  });

  test('obtenerServicio', async () => {
    const s = await servicioService.obtenerServicio(servicioId);
    expect(s.nombre).toContain(TEST_SUFFIX);
    expect(s.estado).toBe('activo');
  });

  test('obtenerServiciosActivos', async () => {
    const activos = await servicioService.obtenerServiciosActivos();
    expect(activos.some((s) => s.id === servicioId)).toBe(true);
  });

  test('editarServicio', async () => {
    await servicioService.editarServicio(servicioId, { precio: 30000 });
    const s = await servicioService.obtenerServicio(servicioId);
    expect(s.precio).toBe(30000);
  });

  test('validacion duracion', async () => {
    await expect(
      servicioService.crearServicio({
        nombre: 'Test', descripcion: '', precio: 100, duracion: 0,
      })
    ).rejects.toThrow('duración');
  });
});

describe('04 - ClienteService', () => {

  test('crearCliente', async () => {
    const result = await clienteService.crearCliente({
      nombre: `Cliente Test ${TEST_SUFFIX}`,
      telefono: '3001234567',
      email: `cliente_${TEST_SUFFIX}@mail.com`,
      observaciones: 'Cliente de prueba',
    });
    expect(result.id).toBeDefined();
    clienteId = result.id;
  });

  test('obtenerCliente', async () => {
    const c = await clienteService.obtenerCliente(clienteId);
    expect(c.nombre).toContain(TEST_SUFFIX);
  });

  test('buscarPorTelefono', async () => {
    const c = await clienteService.buscarPorTelefono('3001234567');
    expect(c).not.toBeNull();
    expect(c!.nombre).toContain(TEST_SUFFIX);
  });

  test('editarCliente', async () => {
    await clienteService.editarCliente(clienteId, { observaciones: 'Editado' });
    const c = await clienteService.obtenerCliente(clienteId);
    expect(c.observaciones).toBe('Editado');
  });
});

describe('05 - VehiculoService', () => {

  test('crearVehiculo', async () => {
    const result = await vehiculoService.crearVehiculo({
      placa: `TEST${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      marca: 'Toyota',
      modelo: 'Corolla 2020',
      color: 'Blanco',
      tipo: 'Sedán',
      propietario_id: clienteId,
    });
    expect(result.id).toBeDefined();
    vehiculoId = result.id;
  });

  test('obtenerVehiculo', async () => {
    const v = await vehiculoService.obtenerVehiculo(vehiculoId);
    expect(v.marca).toBe('Toyota');
  });

  test('buscarPorPlaca', async () => {
    const v = await vehiculoService.buscarPorPlaca('ABC-NONEXIST');
    expect(v).toBeNull();
  });

  test('obtenerVehiculosPorPropietario', async () => {
    const vehiculos = await vehiculoService.obtenerVehiculosPorPropietario(clienteId);
    expect(vehiculos.length).toBeGreaterThanOrEqual(1);
  });

  test('validacion placa duplicada', async () => {
    const v = await vehiculoService.obtenerVehiculo(vehiculoId);
    await expect(
      vehiculoService.crearVehiculo({
        placa: v!.placa,
        marca: 'Test', modelo: '', color: '', tipo: '', propietario_id: clienteId,
      })
    ).rejects.toThrow('placa ya está registrada');
  });
});

describe('06 - RegistroLavadoService', () => {

  test('crearRegistro', async () => {
    const result = await registroService.crearRegistro({
      cliente_id: clienteId,
      vehiculo_id: vehiculoId,
      colaborador_id: colaboradorId,
      servicio_id: servicioId,
      precio: 30000,
      observaciones: 'Test de lavado',
    });
    expect(result.id).toBeDefined();
    lavadoId = result.id;
  });

  test('obtenerRegistro', async () => {
    const r = await registroService.obtenerRegistro(lavadoId);
    expect(r.cliente_id).toBe(clienteId);
    expect(r.estado).toBe('completado');
  });

  test('obtenerRegistrosPorColaborador', async () => {
    const registros = await registroService.obtenerRegistrosPorColaborador(colaboradorId);
    expect(registros.some((r) => r.id === lavadoId)).toBe(true);
  });

  test('obtenerRegistrosPorFecha', async () => {
    const desde = Date.now() - 86400000;
    const hasta = Date.now() + 86400000;
    const registros = await registroService.obtenerRegistrosPorFecha(desde, hasta);
    expect(registros.some((r) => r.id === lavadoId)).toBe(true);
  });

  test('editarRegistro', async () => {
    await registroService.editarRegistro(lavadoId, { observaciones: 'Editado test' });
    const r = await registroService.obtenerRegistro(lavadoId);
    expect(r.observaciones).toBe('Editado test');
  });
});

describe('07 - GastoService', () => {

  test('crearGasto', async () => {
    const result = await gastoService.crearGasto({
      concepto: `Compra insumos ${TEST_SUFFIX}`,
      monto: 150000,
      categoria: 'Insumos',
      fecha: Date.now(),
    });
    expect(result.id).toBeDefined();
    gastoId = result.id;
  });

  test('obtenerGasto', async () => {
    const g = await gastoService.obtenerGasto(gastoId);
    expect(g.concepto).toContain(TEST_SUFFIX);
  });

  test('obtenerGastosPorFecha', async () => {
    const desde = Date.now() - 86400000;
    const hasta = Date.now() + 86400000;
    const gastos = await gastoService.obtenerGastosPorFecha(desde, hasta);
    expect(gastos.some((g) => g.id === gastoId)).toBe(true);
  });

  test('validacion monto negativo', async () => {
    await expect(
      gastoService.crearGasto({ concepto: 'Test', monto: -100, categoria: 'Test', fecha: Date.now() })
    ).rejects.toThrow('monto');
  });
});

describe('08 - Limpieza final (eliminar)', () => {

  test('eliminarGasto', async () => {
    await gastoService.eliminarGasto(gastoId);
    await expect(gastoService.obtenerGasto(gastoId)).rejects.toThrow('no encontrado');
  });

  test('eliminarRegistro', async () => {
    await registroService.eliminarRegistro(lavadoId);
    await expect(registroService.obtenerRegistro(lavadoId)).rejects.toThrow('no encontrado');
  });

  test('eliminarVehiculo', async () => {
    await vehiculoService.eliminarVehiculo(vehiculoId);
    await expect(vehiculoService.obtenerVehiculo(vehiculoId)).rejects.toThrow('no encontrado');
  });

  test('eliminarCliente', async () => {
    await clienteService.eliminarCliente(clienteId);
    await expect(clienteService.obtenerCliente(clienteId)).rejects.toThrow('no encontrado');
  });

  test('eliminarServicio', async () => {
    await servicioService.eliminarServicio(servicioId);
    await expect(servicioService.obtenerServicio(servicioId)).rejects.toThrow('no encontrado');
  });

  test('eliminarProducto', async () => {
    await productoService.eliminarProducto(productoId);
    await expect(productoService.obtenerProducto(productoId)).rejects.toThrow('no encontrado');
  });

  test('eliminarUsuario admin', async () => {
    await usuarioService.eliminarUsuario(adminId);
    await expect(usuarioService.obtenerUsuario(adminId)).rejects.toThrow('no encontrado');
  });

  test('eliminarUsuario colaborador', async () => {
    await usuarioService.eliminarUsuario(colaboradorId);
    await expect(usuarioService.obtenerUsuario(colaboradorId)).rejects.toThrow('no encontrado');
  });
});
