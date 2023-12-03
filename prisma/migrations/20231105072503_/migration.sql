/*
  Warnings:

  - You are about to drop the `UserReplies` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserReplies" DROP CONSTRAINT "UserReplies_commentId_fkey";

-- DropForeignKey
ALTER TABLE "UserReplies" DROP CONSTRAINT "UserReplies_userId_fkey";

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "parentId" SERIAL;

-- DropTable
DROP TABLE "UserReplies";

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
