import { Router } from "express";

import {handleCreateExpense,handleCreateFriendExpense,handleDeleteExpense,handleGetExpensesForGroup,handleUpdateExpense , handleGetFriendExpenses} from '../controllers/expenseController'

import {auth} from '../middlewares/auth';
import { sanitizer } from "../middlewares/sanitizer";
import { validate } from "../middlewares/validation";

import {createExpenseSchema,updateExpenseSchema, createFriendExpenseSchema } from '../schemas/expenseSchema';

const router = Router();


router.use(auth);


router.post('/',sanitizer,validate(createExpenseSchema),handleCreateExpense);
router.get('/group/:groupId',handleGetExpensesForGroup);
router.put('/:expenseId',sanitizer,validate(updateExpenseSchema),handleUpdateExpense);
router.delete('/:expenseId',handleDeleteExpense);


router.post('/friend',sanitizer,validate(createFriendExpenseSchema),handleCreateFriendExpense);
router.get('/friend/:friendId', handleGetFriendExpenses);


export default router;

