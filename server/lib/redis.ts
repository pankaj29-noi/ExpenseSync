import {Redis} from 'ioredis'
import {config} from 'dotenv'
config();

export const redisClient = new Redis(process.env.REDIS_URL!);

redisClient.on('connect',()=>{
    // console.log('Redis client connected successfully');
});

redisClient.on('error', (error) => {
  // console.error('Redis connection error:', error);
});
