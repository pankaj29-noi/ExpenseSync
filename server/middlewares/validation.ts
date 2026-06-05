
import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export const validate = (schema: z.Schema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error: any) {
    if (error instanceof ZodError) {
      // Safely access the first issue's message, or provide a default
      const errorMessage = error.issues[0]?.message ?? 'Invalid input'; 
      return res.status(400).json({ error: errorMessage });
    }
    
    // Handle other unexpected errors
    res.status(500).json({ error: 'Internal server error' });
  }
};
