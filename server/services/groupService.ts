import { prismaClient } from '../lib/prisma';
import { redisClient } from '../lib/redis';
import { sendInvitationEmail } from '../lib/resend';


export const createGroup = async (name: string, creatorId: string) => {
  const newGroup = await prismaClient.$transaction(async (prisma) => {
    const group = await prisma.group.create({
      data: { name: name.trim(), creatorId },
    });

    await prisma.membersOnGroups.create({
      data: {
        groupId: group.id,
        userId: creatorId,
        assignedBy: creatorId,
      },
    });

    return group;
  });

  return newGroup;
};


export const getGroupsForUser = async (userId: string) => {
  return prismaClient.group.findMany({
    where: {
      members: {
        some: { userId },
      },
    },
    include: {
      members: {
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      },
      _count: {
        select: { expenses: true, members: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};


export const getGroupDetails = async (groupId: string) => {
  return prismaClient.group.findUniqueOrThrow({
    where: { id: groupId },
    include: {
      members: {
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      },
      expenses: {
        include: {
          payer: { select: { id: true, name: true, email: true } },
          splits: {
            include: {
              user: { select: { id: true, name: true, email: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      _count: {
        select: { expenses: true, members: true },
      },
    },
  });
};


export const addMemberToGroup = async (
  groupId: string,
  memberEmail: string,
  addedByUserId: string
) => {
  const userToAdd = await prismaClient.user.findUnique({
    where: { email: memberEmail.trim().toLowerCase() },
  });


  if (!userToAdd) {
    console.log("Sending invitation email...");

    const group = await prismaClient.group.findUnique({
      where: { id: groupId },
      select: { name: true },
    });

    const addedBy = await prismaClient.user.findUnique({
      where: { id: addedByUserId },
      select: { name: true },
    });

    await sendInvitationEmail(
      memberEmail,
      addedBy?.name || "Someone",
      group?.name || "this group",
      groupId
    );

    throw new Error("INVITATION_SENT");
  }

  const newMember = await prismaClient.membersOnGroups.create({
    data: {
      groupId,
      userId: userToAdd.id,
      assignedBy: addedByUserId,
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });

  await invalidateGroupCache(groupId);
  return newMember;
};



export const removeMemberFromGroup = async (
  groupId: string,
  userIdToRemove: string
) => {
  const result = await prismaClient.membersOnGroups.delete({
    where: {
      userId_groupId: { userId: userIdToRemove, groupId },
    },
  });

  await invalidateGroupCache(groupId);

  return result;
};


export const updateGroup = async (groupId: string, newName: string) => {
  const updated = await prismaClient.group.update({
    where: { id: groupId },
    data: { name: newName.trim() },
  });

  await invalidateGroupCache(groupId);
  return updated;
};


export const deleteGroup = async (groupId: string) => {
  return prismaClient.$transaction(async (prisma) => {
    await prisma.expenseSplit.deleteMany({
      where: { expense: { groupId } },
    });

    await prisma.expense.deleteMany({ where: { groupId } });

    await prisma.settlement.deleteMany({ where: { groupId } });

    await prisma.membersOnGroups.deleteMany({ where: { groupId } });

    const deleted = await prisma.group.delete({ where: { id: groupId } });

    await invalidateGroupCache(groupId);
    return deleted;
  });
};


export const findOrCreateFriendGroup = async (u1: string, u2: string) => {
  const existing = await prismaClient.group.findFirst({
    where: {
      isDirectFriendGroup: true,
      AND: [
        { members: { some: { userId: u1 } } },
        { members: { some: { userId: u2 } } },
      ],
    },
    include: {
      _count: { select: { members: true } },
      members: true,
    },
  });

  if (existing && existing._count.members === 2) return existing;

  const users = await prismaClient.user.findMany({
    where: { id: { in: [u1, u2] } },
    select: { id: true, name: true, email: true },
  });

  if (users.length !== 2) throw new Error("Users not found");

  const newGroup = await prismaClient.$transaction(async (prisma) => {
    const group = await prisma.group.create({
      data: {
        name: `Friends: ${users[0].name} & ${users[1].name}`,
        creatorId: u1,
        isDirectFriendGroup: true,
      },
    });

    await prisma.membersOnGroups.createMany({
      data: [
        { userId: u1, groupId: group.id, assignedBy: u1 },
        { userId: u2, groupId: group.id, assignedBy: u1 },
      ],
    });

    return { ...group, members: users };
  });

  return newGroup;
};

export const findFriendGroup = async (u1: string, u2: string) => {
  const existing = await prismaClient.group.findFirst({
    where: {
      isDirectFriendGroup: true,
      AND: [
        { members: { some: { userId: u1 } } },
        { members: { some: { userId: u2 } } },
      ],
    },
    include: {
      _count: { select: { members: true } },
      members: {
        include: { user: { select: { id: true, name: true, email: true } } },
      },
    },
  });

  return existing && existing._count.members === 2 ? existing : null;
};


const invalidateGroupCache = async (groupId: string) => {
  try {
    const key = `group:balance:${groupId}`;
    await redisClient.del(key);
    // console.log("Redis Cache Cleared →", key);
  } catch (err) {
    // console.error("Redis DEL Error:", err);
  }
};
