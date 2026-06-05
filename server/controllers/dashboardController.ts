import { Request, Response } from "express";
import { prismaClient } from "../lib/prisma";
import { redisClient } from "../lib/redis";
import { calculateGroupBalance } from "../services/balanceService";

export const handleGetDashboardStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const cacheKey = `dashboard:${userId}`;

    // cache check 
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // count grp
    const groupsCount = await prismaClient.group.count({
      where: {
        members: { some: { userId } },
        isDirectFriendGroup: false,
      },
    });

    // count expenses
    const expensesCount = await prismaClient.expense.count({
      where: {
        OR: [
          { payerId: userId },
          { splits: { some: { userId } } },
        ],
      },
    });

    // Pending settlements 
    let pending = 0;

    const groups = await prismaClient.group.findMany({
      where: {
        members: { some: { userId } },
        isDirectFriendGroup: false,
      },
      select: { id: true },
    });

    for (const g of groups) {
      const balance = await calculateGroupBalance(g.id);

      pending += balance.settlements.filter(
        s => s.from === userId || s.to === userId
      ).length;
    }

    const result = {
      totalGroups: groupsCount,
      totalExpenses: expensesCount,
      pendingSettlements: pending,
    };

    // Cache - 60 seconds
    await redisClient.set(cacheKey, JSON.stringify(result), "EX", 60);

    res.json(result);

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
};
