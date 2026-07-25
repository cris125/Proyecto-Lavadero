import serverless from 'serverless-http';
import app from '../../back_end/main';

export const handler = serverless(app);
