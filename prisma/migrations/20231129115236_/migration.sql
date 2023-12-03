/*
  Warnings:

  - You are about to drop the column `parentTaskId` on the `Task` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_parentTaskId_fkey";

-- AlterTable
ALTER TABLE "Resource" ADD COLUMN     "keys" INTEGER;

-- AlterTable
ALTER TABLE "Sheet" ADD COLUMN     "keys" INTEGER;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "parentTaskId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "coins" INTEGER NOT NULL DEFAULT 400,
ADD COLUMN     "keys" INTEGER NOT NULL DEFAULT 3;
