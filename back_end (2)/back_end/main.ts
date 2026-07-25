import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { errorHandler } from './middlewares/error_handler';
import routes from './routes/index';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${env.PORT}`);
});

export default app;
