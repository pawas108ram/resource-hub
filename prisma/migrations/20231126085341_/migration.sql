-- CreateEnum
CREATE TYPE "QuestionStatus" AS ENUM ('UNATTEMPTED', 'REVISED', 'SOLVED', 'SKIPPED');

-- CreateTable
CREATE TABLE "QuestionUserStatus" (
    "id" SERIAL NOT NULL,
    "status" "QuestionStatus" NOT NULL DEFAULT 'UNATTEMPTED',
    "questionId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "QuestionUserStatus_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QuestionUserStatus" ADD CONSTRAINT "QuestionUserStatus_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionUserStatus" ADD CONSTRAINT "QuestionUserStatus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
