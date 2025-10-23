import { Router } from 'express';
import { db } from '../db';

const router = Router();

// Very small stub - accepts any username/password and returns a fake token
router.post('/login', async (req, res) => {
  const { username } = req.body;
  await db.read();
  let user = db.data?.users.find((u: any) => u.username === username);
  if (!user) {
    user = { id: username || 'user-' + Date.now(), username };
    db.data?.users.push(user);
    await db.write();
  }
  res.json({ token: 'fake-jwt-token', user });
});

export default router;
