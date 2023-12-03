/*
  Warnings:

  - You are about to drop the column `requesteeId` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `requestorId` on the `Request` table. All the data in the column will be lost.
  - Added the required column `requestMakerId` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requestRecieverId` to the `Request` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_requesteeId_fkey";

-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_requestorId_fkey";

-- AlterTable
ALTER TABLE "Request" DROP COLUMN "requesteeId",
DROP COLUMN "requestorId",
ADD COLUMN     "requestMakerId" INTEGER NOT NULL,
ADD COLUMN     "requestRecieverId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_requestMakerId_fkey" FOREIGN KEY ("requestMakerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_requestRecieverId_fkey" FOREIGN KEY ("requestRecieverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
