import { z } from 'zod';

export const createSettlementSchema = z.object({
  // The schema should directly match the structure of req.body
  amount: z.number().positive({ message: 'Amount must be a positive number' }),
  groupId: z.string().uuid({ message: 'Invalid group ID' }),
  receiverId: z.string().uuid({ message: 'Invalid receiver ID' }),
});



