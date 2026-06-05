import { prismaClient } from "../lib/prisma";
import { redisClient } from "../lib/redis";

export const createSettlement = async (
  payerId: string,
  receiverId: string,
  groupId: string,
  amount: number
) => {
  if (amount <= 0) throw new Error("Amount must be positive");

  return await prismaClient.$transaction(async (tx) => {
    const settlement = await tx.settlement.create({
      data: {
        payerId,
        receiverId,
        groupId,
        amount,
        isCompleted: false
      }
    });

    const expense = await tx.expense.create({
      data: {
        description: "Settlement Payment",
        amount,
        category: "OTHER",
        payerId,
        groupId,
        splits: {
          create: [{ userId: receiverId, amount }]
        }
      }
    });
    
    await redisClient.del(`group:balance:${groupId}`).catch(() => {});

    return { settlement, expense };
  });
};

export const completeSettlement = async (settlementId: string) => {
  return await prismaClient.settlement.update({
    where: { id: settlementId },
    data: { isCompleted: true }
  });
};






