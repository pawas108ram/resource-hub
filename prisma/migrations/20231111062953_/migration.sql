/*
  Warnings:

  - You are about to drop the column `dislikes` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `Question` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Question" DROP COLUMN "dislikes",
DROP COLUMN "likes";

-- CreateTable
CREATE TABLE "QuestionLikes" (
    "id" SERIAL NOT NULL,
    "questionId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "QuestionLikes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionDislikes" (
    "id" SERIAL NOT NULL,
    "questionId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "QuestionDislikes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QuestionLikes" ADD CONSTRAINT "QuestionLikes_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionLikes" ADD CONSTRAINT "QuestionLikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionDislikes" ADD CONSTRAINT "QuestionDislikes_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionDislikes" ADD CONSTRAINT "QuestionDislikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
