-- CreateEnum
CREATE TYPE "QuestionStatus" AS ENUM ('SOLVED', 'REVISED', 'UNSOLVED');

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "questionStatus" "QuestionStatus" NOT NULL DEFAULT 'UNSOLVED';
