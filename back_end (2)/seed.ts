import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, child } from 'firebase/database';
import { hashPassword } from './back_end/utils/hash';
import type { Usuario } from './back_end/models/Usuario';

const FIREBASE_DATABASE_URL = process.env.FIREBASE_DATABASE_URL || 'https://lavadero-e1f41-default-rtdb.firebaseio.com/';

const app = initializeApp({ databaseURL: FIREBASE_DATABASE_URL });
const db = getDatabase(app);

const ADMIN_EMAIL = 'admin@lavadero.com';
const ADMIN_PASSWORD = 'Admin123!';

async function seed() {
  const snapshot = await get(child(ref(db), 'usuarios'));
  const usuarios: Record<string, Usuario> = snapshot.val() || {};

  const existe = Object.values(usuarios).find((u) => u.email === ADMIN_EMAIL);
  if (existe) {
    console.log(`[seed] El administrador ${ADMIN_EMAIL} ya existe (id: ${existe.id})`);
    process.exit(0);
  }

  const hashedPassword = await hashPassword(ADMIN_PASSWORD);
  const now = Date.now();
  const id = `usr_admin_${now}`;
  const usuario: Usuario = {
    id,
    nombre: 'Admin',
    apellido: 'Sistema',
    email: ADMIN_EMAIL,
    telefono: '3000000000',
    contraseña: hashedPassword,
    rol: 'ADMIN',
    estado: 'activo',
    createdAt: now,
    updatedAt: now,
  };

  await set(ref(db, `usuarios/${id}`), usuario);
  console.log(`[seed] Administrador creado exitosamente:`);
  console.log(`  Email:    ${ADMIN_EMAIL}`);
  console.log(`  Password: ${ADMIN_PASSWORD}`);
  console.log(`  Rol:      ADMIN`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('[seed] Error:', err);
  process.exit(1);
});
