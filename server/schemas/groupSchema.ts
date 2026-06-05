import { z } from 'zod';


export const createGroupSchema = z.object({
  name: z.string().min(1, { message: 'Group name cannot be empty' }),
});


export const updateGroupSchema = z.object({
  name: z.string().min(1, { message: 'Group name cannot be empty' }),
});


export const addMemberSchema = z.object({
  email: z.string().email({ message: 'A valid email is required to add a member' }),
});