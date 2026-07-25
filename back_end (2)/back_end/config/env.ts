export const env = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL || 'https://lavadero-e1f41-default-rtdb.firebaseio.com/',
};
