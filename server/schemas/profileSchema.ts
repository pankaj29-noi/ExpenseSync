import { z } from 'zod';

export const updateProfileSchema = z
  .object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }).optional(),
    email: z.string().email({ message: 'Invalid email address' }).optional(),
  })
  .refine((data) => data.name || data.email, {
    message: 'Either name or email must be provided to update',
    path: ['name', 'email'],
  });