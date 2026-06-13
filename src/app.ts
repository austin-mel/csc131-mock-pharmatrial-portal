import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/index';

dotenv.config({ path: 'environment/.back-end.env' });

const app = express();
const corsOrigins = process.env.CORS_ORIGIN?.split(',').map((origin) => origin.trim());

app.use(cors({ origin: corsOrigins?.length ? corsOrigins : true }));
app.use(express.json());

app.use('/api', router);

export default app;
