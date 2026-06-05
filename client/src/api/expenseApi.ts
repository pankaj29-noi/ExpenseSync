import { axiosInstance } from '../lib/axiosInstance';


export enum ExpenseCategory {
  FOOD = 'FOOD',
  TRAVEL = 'TRAVEL', 
  SHOPPING = 'SHOPPING',
  HOUSING = 'HOUSING',
  ENTERTAINMENT = 'ENTERTAINMENT',
  OTHER = 'OTHER'
}


export interface ExpenseSplit {
  userId: string;
  amount: number;
}

export interface ExpenseUser {
  id: string;
  name: string;
  email: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  payerId: string;
  groupId: string;
  createdAt: string;
  payer: ExpenseUser;
  splits: Array<{
    id: string;
    amount: number;
    userId: string;
    user: ExpenseUser;
  }>;
}


export interface CreateExpenseData {
  description: string;
  amount: number;
  groupId: string;
  splits: ExpenseSplit[];
  category?: ExpenseCategory;
}

export interface CreateFriendExpenseData {
  description: string;
  amount: number;
  friendId: string;
  category?: ExpenseCategory;
  splits: ExpenseSplit[];
}

export interface UpdateExpenseData {
  description?: string;
  amount?: number;
  category?: ExpenseCategory;
  splits?: ExpenseSplit[];
}


export interface CreateExpenseResponse {
  message: string;
  expense: Expense;
}

export interface UpdateExpenseResponse {
  message: string;
  expense: Expense;
}


export const expenseApi = {
 
  createExpense: async (data: CreateExpenseData): Promise<Expense> => {
    const response = await axiosInstance.post<CreateExpenseResponse>('/expenses', data);
    return response.data.expense;
  },

  getGroupExpenses: async (groupId: string): Promise<Expense[]> => {
    const response = await axiosInstance.get<Expense[]>(`/expenses/group/${groupId}`);
    return response.data;
  },


  updateExpense: async (expenseId: string, data: UpdateExpenseData): Promise<Expense> => {
    const response = await axiosInstance.put<UpdateExpenseResponse>(`/expenses/${expenseId}`, data);
    return response.data.expense;
  },

  deleteExpense: async (expenseId: string): Promise<void> => {
    await axiosInstance.delete(`/expenses/${expenseId}`);
  },

  
  createFriendExpense: async (data: CreateFriendExpenseData): Promise<Expense> => {
    const response = await axiosInstance.post<CreateExpenseResponse>('/expenses/friend', data);
    return response.data.expense;
  },
};

export default expenseApi;
