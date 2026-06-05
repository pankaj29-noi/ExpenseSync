import { Request,Response,NextFunction } from "express";
import {supabase} from '../lib/supabase'

export const optionalAuth = async(req:Request,res:Response,next:NextFunction)=>{

    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){ // iska mtlb token hi nhi hai -> mtlb user not looged in it is as guest bro
        return next(); 
    }

    const token = authHeader.split(' ')[1];

    const { data: { user } } = await supabase.auth.getUser(token);

    if (user) {
    req.user = user; 
  }

  next();

}