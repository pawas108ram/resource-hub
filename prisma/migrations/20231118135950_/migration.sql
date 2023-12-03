/*
  Warnings:

  - You are about to drop the column `dislikes` on the `Solution` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `Solution` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Solution" DROP COLUMN "dislikes",
DROP COLUMN "likes";

-- CreateTable
CREATE TABLE "SolutionLikes" (
    "id" SERIAL NOT NULL,
    "solutionId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "SolutionLikes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SolutionDislikes" (
    "id" SERIAL NOT NULL,
    "solutionId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "SolutionDislikes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SolutionLikes" ADD CONSTRAINT "SolutionLikes_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "Solution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolutionLikes" ADD CONSTRAINT "SolutionLikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolutionDislikes" ADD CONSTRAINT "SolutionDislikes_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "Solution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolutionDislikes" ADD CONSTRAINT "SolutionDislikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
