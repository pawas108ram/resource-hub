-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "QuestionTag" ADD VALUE 'BinarySearch';
ALTER TYPE "QuestionTag" ADD VALUE 'SlidingWindow';
ALTER TYPE "QuestionTag" ADD VALUE 'TwoPointer';
ALTER TYPE "QuestionTag" ADD VALUE 'DivideAndConquer';
ALTER TYPE "QuestionTag" ADD VALUE 'Recursion';
ALTER TYPE "QuestionTag" ADD VALUE 'Memoization';
ALTER TYPE "QuestionTag" ADD VALUE 'NumberTheory';
ALTER TYPE "QuestionTag" ADD VALUE 'SieveOfEratosthenes';
