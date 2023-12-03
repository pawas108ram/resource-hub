/*
  Warnings:

  - Added the required column `type` to the `Solution` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SolutionType" AS ENUM ('BruteForce', 'Optimal', 'Optimum');

-- AlterTable
ALTER TABLE "Solution" ADD COLUMN     "type" "SolutionType" NOT NULL;
