import { ExpenseCategory } from "@prisma/client";
import { prismaClient } from "../lib/prisma";
import { redisClient } from "../lib/redis";


interface Split {
  userId: string;
  amount: number;
}

interface UpdateExpenseData {
  description?: string;
  amount?: number;
  category?: ExpenseCategory;
  splits?: Split[];
}

interface CreateExpenseData {
  description: string;
  amount: number;
  payerId: string;
  groupId: string;
  splits: Split[];
  category?: ExpenseCategory;
}

export const createExpense = async (data: CreateExpenseData) => {
  const totalSplits = data.splits.reduce((sum, s) => sum + s.amount, 0);

  if (Math.abs(totalSplits - data.amount) > 0.01) {
    throw new Error("Total splits must equal expense amount");
  }

  const expense = await prismaClient.$transaction(async prisma => {
    return await prisma.expense.create({
      data: {
        description: data.description,
        amount: data.amount,
        payerId: data.payerId,
        groupId: data.groupId,
        ...(data.category && { category: data.category }),
        splits: { create: data.splits }
      },
      include: {
        payer: { select: { id: true, name: true, email: true } },
        splits: {
          include: {
            user: { select: { id: true, name: true, email: true } }
          }
        },
        group: { select: { id: true, name: true } }
      }
    });
  });

  await invalidateGroupBalance(data.groupId);
  return expense;
};


export const getExpenseForGroup = async (groupId: string) => {
  return await prismaClient.expense.findMany({
    where: { groupId },
    include: {
      payer: { select: { id: true, name: true, email: true } },
      splits: {
        include: {
          user: { select: { id: true, name: true, email: true } }
        }
      },
      group: { select: { id: true, name: true } }
    },
    orderBy: { createdAt: "desc" }
  });
};




export const updateExpense = async (
  expenseId: string,
  dataToUpdate: UpdateExpenseData
) => {
  const existing = await prismaClient.expense.findUniqueOrThrow({
    where: { id: expenseId },
    include: { splits: true }
  });

  if (dataToUpdate.splits && dataToUpdate.amount) {
    const totalSplits = dataToUpdate.splits.reduce((sum, s) => sum + s.amount, 0);

    if (Math.abs(totalSplits - dataToUpdate.amount) > 0.01) {
      throw new Error("Total splits must equal expense amount");
    }
  }

  const updated = await prismaClient.$transaction(async prisma => {
    
    if (dataToUpdate.splits) {
      await prisma.expenseSplit.deleteMany({ where: { expenseId } });

      await prisma.expenseSplit.createMany({
        data: dataToUpdate.splits.map(s => ({
          expenseId,
          userId: s.userId,
          amount: s.amount
        }))
      });
    }

    // when we try to update - we want the copy of previous data so '...' operator 
    return prisma.expense.update({
      where: { id: expenseId },
      data: {
        ...(dataToUpdate.description && { description: dataToUpdate.description }),
        ...(dataToUpdate.amount && { amount: dataToUpdate.amount }),
        ...(dataToUpdate.category && { category: dataToUpdate.category })
      },
      include: {
        payer: { select: { id: true, name: true, email: true } },
        splits: {
          include: {
            user: { select: { id: true, name: true, email: true } }
          }
        }
      }
    });
  });

  await invalidateGroupBalance(existing.groupId);
  return updated;
};


export const deleteExpense = async (expenseId: string) => {
  const existing = await prismaClient.expense.findUniqueOrThrow({
    where: { id: expenseId }
  });

  await prismaClient.expense.delete({
    where: { id: expenseId }
  });

  await invalidateGroupBalance(existing.groupId);
  return true;
};



const invalidateGroupBalance = async (groupId: string) => {
  try {
    const key = `group:balance:${groupId}`;
    await redisClient.del(key);
    // console.log(" Redis Cache Cleared →", key);
  } catch (err) {
    // console.error(" Redis DEL error:", err);
  }
};
