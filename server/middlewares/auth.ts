import { Request, Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
 
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided or malformed header' });
  }
  const token = authHeader.split(' ')[1];

  try {
    
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

   
    req.user = user;

    
    next();
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
};



