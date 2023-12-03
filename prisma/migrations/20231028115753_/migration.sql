/*
  Warnings:

  - You are about to drop the column `url` on the `Resource` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Sheet` table. All the data in the column will be lost.
  - Added the required column `resourceId` to the `Request` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "resourceId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Resource" DROP COLUMN "url";

-- AlterTable
ALTER TABLE "Sheet" DROP COLUMN "url";

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;
