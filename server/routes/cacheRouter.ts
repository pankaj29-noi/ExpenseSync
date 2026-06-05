import { Router } from 'express';
import { redisClient } from '../lib/redis';

const router = Router();

router.delete('/clear-cache', async (req, res) => {
  try {
    await redisClient.flushall();
    res.json({ message: ' Redis cache cleared successfully!' });
  } catch (error) {
    console.error('Cache clear error:', error);
    res.status(500).json({ error: 'Failed to clear cache' });
  }
});

export default router;

// NOTE - Temporory Route for testing Purpose for cache Clean
