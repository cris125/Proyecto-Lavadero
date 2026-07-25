import { db } from '../../back_end/config/firebase';
import { ref, remove } from 'firebase/database';

const testIds: string[] = [];

export function registrarTestId(id: string): void {
  testIds.push(id);
}

export async function limpiarTestIds(): Promise<void> {
  for (const id of testIds) {
    try {
      await remove(ref(db, id));
    } catch {
      // ignorar errores de limpieza
    }
  }
  testIds.length = 0;
}

export function buildPath(basePath: string, id: string): string {
  const fullPath = `${basePath}/${id}`;
  registrarTestId(fullPath);
  return fullPath;
}
