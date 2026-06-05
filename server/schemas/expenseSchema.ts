import { z } from 'zod';
import { ExpenseCategory } from '@prisma/client'; // Import the enum from Prisma

// Schema for a single user's split
const expenseSplitSchema = z.object({
  userId: z.string().uuid({ message: 'Invalid user ID' }),
  amount: z.number().positive({ message: 'Split amount must be a positive number' }),
});

// Main schema for creating a new expense
export const createExpenseSchema = z
  .object({
    description: z.string().min(1, { message: 'Description cannot be empty' }),
    amount: z.number().positive({ message: 'Amount must be a positive number' }),
    groupId: z.string().uuid({ message: 'Invalid group ID' }),
    category: z.nativeEnum(ExpenseCategory).default(ExpenseCategory.OTHER),
    splits: z.array(expenseSplitSchema).min(1, { message: 'At least one split is required' }),
  })
  .refine(
    (data) => {
      // Calculate the sum of all individual splits
      const totalSplitAmount = data.splits.reduce((sum, split) => sum + split.amount, 0);
      // Check if the sum of splits is reasonably close to the total amount
      return Math.abs(totalSplitAmount - data.amount) < 0.01;
    },
    {
      message: 'The sum of the splits must equal the total expense amount.',
      path: ['splits'], // Show the error on the 'splits' field
    }
  );

// Schema for updating an existing expense
export const updateExpenseSchema = z
  .object({
    description: z.string().min(1).optional(),
    amount: z.number().positive().optional(),
    category: z.nativeEnum(ExpenseCategory).optional(),
    splits: z.array(expenseSplitSchema).min(1).optional(),
  })
  .refine(
    (data) => {
      // If both amount and splits are provided, they must match.
      if (data.amount && data.splits) {
        const totalSplitAmount = data.splits.reduce((sum, split) => sum + split.amount, 0);
        return Math.abs(totalSplitAmount - data.amount) < 0.01;
      }
      return true; // If only one or neither is provided, validation passes here.
    },
    {
      message: 'The sum of the new splits must equal the new total expense amount.',
      path: ['splits'],
    }
  );


// Freind wala --

export const createFriendExpenseSchema = z.object({
    description: z.string().min(1, { message: 'Description cannot be empty' }),
    amount: z.number().positive({ message: 'Amount must be a positive number' }),
    friendId: z.string().uuid({ message: 'Invalid friend ID' }), 
    category: z.nativeEnum(ExpenseCategory).default(ExpenseCategory.OTHER),
    splits: z
      .array(expenseSplitSchema)
      .length(2, { message: 'A friend expense must have exactly two splits.' }),
  })
  .refine(
    (data) => {
      const totalSplitAmount = data.splits.reduce((sum, split) => sum + split.amount, 0);
      return Math.abs(totalSplitAmount - data.amount) < 0.01;
    },
    {
      message: 'The sum of the two splits must equal the total expense amount.',
      path: ['splits'],
    }
  );
