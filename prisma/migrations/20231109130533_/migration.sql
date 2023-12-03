/*
  Warnings:

  - You are about to drop the column `questionStatus` on the `Question` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Question" DROP COLUMN "questionStatus";

-- DropEnum
DROP TYPE "QuestionStatus";
