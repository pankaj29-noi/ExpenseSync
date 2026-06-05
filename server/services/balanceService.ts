import { prismaClient } from "../lib/prisma";
import { redisClient } from "../lib/redis";

interface Balance {
  userId: string;
  name: string;
  balance: number;
}

interface Settlement {
  from: string;
  to: string;
  fromName: string;
  toName: string;
  amount: number;
}

export const calculateGroupBalance = async (groupId: string) => {
  const cacheKey = `group:balance:${groupId}`;

  // We have to 1st -> Redis cache
  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) return JSON.parse(cached);
  } catch {}

  // 2️ -> Fetch group data
  const groupData = await prismaClient.group.findUniqueOrThrow({
    where: { id: groupId },
    include: {
      expenses: {
        include: {
          payer: { select: { id: true, name: true, email: true } },
          splits: {
            include: {
              user: { select: { id: true, name: true, email: true } }
            }
          }
        }
      },
      settlements: true
    }
  });

  // 3️ -> balanceMap - Expense se bnanayeng -> Signle sourcr of truth  
  const balancesMap = new Map<string, { name: string; balance: number }>();

  for (const expense of groupData.expenses) {
   
    if (!balancesMap.has(expense.payerId)) {
      balancesMap.set(expense.payerId, {
        name:
          expense.payer.name ??
          expense.payer.email.split("@")[0],
        balance: 0
      });
    }

    balancesMap.get(expense.payerId)!.balance += expense.amount;

    
    for (const split of expense.splits) {
      if (!balancesMap.has(split.userId)) {
        balancesMap.set(split.userId, {
          name:
            split.user.name ??
            split.user.email.split("@")[0],
          balance: 0
        });
      }

      balancesMap.get(split.userId)!.balance -= split.amount;
    }
  }

  // 4️ -> final balances array
  const finalBalances: Balance[] = Array.from(balancesMap.entries()).map(
    ([userId, data]) => ({
      userId,
      name: data.name,
      balance: parseFloat(data.balance.toFixed(2))
    })
  );

  // 5️ -> Apni greedy 
  const creditors = finalBalances
    .filter(b => b.balance > 0.01)
    .map(b => ({ ...b }))
    .sort((a, b) => b.balance - a.balance);

  const debtors = finalBalances
    .filter(b => b.balance < -0.01)
    .map(b => ({ ...b, balance: Math.abs(b.balance) }))
    .sort((a, b) => b.balance - a.balance);

  const settlements: Settlement[] = [];

  let di = 0;
  let ci = 0;

  while (di < debtors.length && ci < creditors.length) {
    const debtor = debtors[di];
    const creditor = creditors[ci];

    const payAmount = Math.min(debtor.balance, creditor.balance);

    settlements.push({
      from: debtor.userId,
      to: creditor.userId,
      fromName: debtor.name,
      toName: creditor.name,
      amount: parseFloat(payAmount.toFixed(2))
    });

    debtor.balance -= payAmount;
    creditor.balance -= payAmount;

    if (debtor.balance <= 0.01) di++;
    if (creditor.balance <= 0.01) ci++;
  }

  const result = {
    balances: finalBalances,
    settlements,
    originalSettlementsCount: groupData.settlements.length,
    completedSettlementsCount: groupData.settlements.filter(s => s.isCompleted).length
  };

  // 6️ -> Cache the result
  try {
    await redisClient.set(cacheKey, JSON.stringify(result), "EX", 600);
  } catch {}

  return result;
};
