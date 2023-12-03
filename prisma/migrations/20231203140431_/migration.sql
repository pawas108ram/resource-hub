/*
  Warnings:

  - You are about to drop the `Request` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PublishStatus" AS ENUM ('UNPUBLISHED', 'PUBLISHED');

-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_requestMakerId_fkey";

-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_requestRecieverId_fkey";

-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_resourceId_fkey";

-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_sheetId_fkey";

-- AlterTable
ALTER TABLE "Resource" ADD COLUMN     "status" "PublishStatus" NOT NULL DEFAULT 'UNPUBLISHED';

-- AlterTable
ALTER TABLE "Sheet" ADD COLUMN     "status" "PublishStatus" NOT NULL DEFAULT 'UNPUBLISHED';

-- DropTable
DROP TABLE "Request";
