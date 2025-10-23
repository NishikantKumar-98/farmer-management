import { Router } from 'express';
import { db } from '../db';
import { nanoid } from 'nanoid';

const router = Router();

router.get('/', async (req, res) => {
  await db.read();
  res.json(db.data?.orders || []);
});

router.post('/', async (req, res) => {
  const body = req.body;
  await db.read();
  const order = { id: nanoid(), ...body };
  db.data?.orders.push(order);
  await db.write();
  res.status(201).json(order);
});

export default router;
