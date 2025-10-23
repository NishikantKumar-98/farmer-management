import { Router } from 'express';
import { db } from '../db';

const router = Router();

router.get('/', async (req, res) => {
  await db.read();
  res.json(db.data?.farms || []);
});

router.get('/:id', async (req, res) => {
  await db.read();
  const farm = db.data?.farms.find((f: any) => f.id === req.params.id);
  if (!farm) return res.status(404).json({ error: 'Not found' });
  res.json(farm);
});

export default router;
