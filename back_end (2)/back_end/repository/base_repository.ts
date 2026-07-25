import { Database, ref, set, remove, get, child, update } from 'firebase/database';

export class BaseRepository<T extends object> {
  protected basePath: string;
  protected db: Database;

  constructor(db: Database, basePath: string) {
    this.db = db;
    this.basePath = basePath;
  }

  async agregar_registro(id: string, data: T): Promise<void> {
    try {
      const referencia = ref(this.db, `${this.basePath}/${id}`);
      await set(referencia, data);
    } catch (error) {
      throw new Error(`Error al agregar en ${this.basePath}: ${error}`);
    }
  }

  async eliminar_registro(id: string): Promise<void> {
    try {
      const referencia = ref(this.db, `${this.basePath}/${id}`);
      await remove(referencia);
    } catch (error) {
      throw new Error(`Error al eliminar en ${this.basePath}: ${error}`);
    }
  }

  async modificar_registro(id: string, data: Partial<T>): Promise<void> {
    try {
      const referencia = ref(this.db, `${this.basePath}/${id}`);
      await update(referencia, data);
    } catch (error) {
      throw new Error(`Error al modificar en ${this.basePath}: ${error}`);
    }
  }

  async obtener_registro(id: string): Promise<T | null> {
    try {
      const dbRef = ref(this.db);
      const snapshot = await get(child(dbRef, `${this.basePath}/${id}`));
      if (snapshot.exists()) {
        const data = snapshot.val() as T;
        (data as Record<string, unknown>).id = id;
        return data;
      }
      return null;
    } catch (error) {
      throw new Error(`Error al obtener en ${this.basePath}: ${error}`);
    }
  }

  async obtener_registros(): Promise<T[]> {
    try {
      const dbRef = ref(this.db);
      const snapshot = await get(child(dbRef, this.basePath));
      if (snapshot.exists()) {
        const data = snapshot.val();
        if (Array.isArray(data)) {
          return data as T[];
        }
        return Object.entries(data).map(([key, value]) => ({ id: key, ...(value as object) })) as T[];
      }
      return [];
    } catch (error) {
      throw new Error(`Error al obtener registros en ${this.basePath}: ${error}`);
    }
  }
}
