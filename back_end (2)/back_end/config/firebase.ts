import { initializeApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';
import { env } from './env';

const firebaseConfig = {
  databaseURL: env.FIREBASE_DATABASE_URL,
};

const app = initializeApp(firebaseConfig);
const db: Database = getDatabase(app);

export { db };
