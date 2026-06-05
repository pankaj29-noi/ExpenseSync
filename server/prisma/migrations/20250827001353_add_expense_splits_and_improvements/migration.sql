/*
  Warnings:

  - Added the required column `creatorId` to the `groups` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."ExpenseCategory" AS ENUM ('FOOD', 'TRAVEL', 'SHOPPING', 'HOUSING', 'ENTERTAINMENT', 'OTHER');

-- DropForeignKey
ALTER TABLE "public"."MembersOnGroups" DROP CONSTRAINT "MembersOnGroups_groupId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MembersOnGroups" DROP CONSTRAINT "MembersOnGroups_userId_fkey";

-- AlterTable
ALTER TABLE "public"."expenses" ADD COLUMN     "category" "public"."ExpenseCategory" NOT NULL DEFAULT 'OTHER';

-- AlterTable
ALTER TABLE "public"."groups" ADD COLUMN     "creatorId" UUID NOT NULL,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'INR';

-- CreateTable
CREATE TABLE "public"."ExpenseSplit" (
    "id" UUID NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "expenseId" UUID NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "ExpenseSplit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExpenseSplit_expenseId_userId_key" ON "public"."ExpenseSplit"("expenseId", "userId");

-- AddForeignKey
ALTER TABLE "public"."MembersOnGroups" ADD CONSTRAINT "MembersOnGroups_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MembersOnGroups" ADD CONSTRAINT "MembersOnGroups_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ExpenseSplit" ADD CONSTRAINT "ExpenseSplit_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "public"."expenses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ExpenseSplit" ADD CONSTRAINT "ExpenseSplit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
