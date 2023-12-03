-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('Recruit', 'Veteran', 'Elite', 'Legendary');

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "difficulty" "Difficulty" NOT NULL DEFAULT 'Recruit';
