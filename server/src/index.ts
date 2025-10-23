import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import farmsRouter from './routes/farms';
import ordersRouter from './routes/orders';
import authRouter from './routes/auth';
import { initDb } from './db';

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 4000;

app.use(cors());
app.use(json());

initDb();

app.use('/api/farms', farmsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/auth', authRouter);

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.listen(port, () => {
  console.log(`AgriConnect API listening on http://localhost:${port}`);
});
