import {RateLimiterRedis} from 'rate-limiter-flexible'
import { Request,Response,NextFunction } from 'express'
import {redisClient} from '../lib/redis'


const loggedInLimiter = new RateLimiterRedis({
    storeClient:redisClient,
    keyPrefix:'rate_limiter_user',
    points:600, // itna isliye - beacuse we impment polling so take care of that 
    duration:60*15
})


const guestLimiter = new RateLimiterRedis({
    storeClient:redisClient,
    keyPrefix:'rate_limit_ip',
    points:20,
    duration:60*15,
})


export const rateLimiterMiddleware = async(req:Request,res:Response,next:NextFunction)=>{

    const userId = req.user?.id;

    try{

        if(userId){
            await loggedInLimiter.consume(userId);
        }else{
            await guestLimiter.consume(req.ip as string);
        }

        next();

    }catch(error){
        res.status(429).json({ error: 'Too many requests, please try again later.' });
    }
} 
