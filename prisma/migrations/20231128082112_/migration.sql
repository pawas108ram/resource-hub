/*
  Warnings:

  - You are about to drop the column `body` on the `Resource` table. All the data in the column will be lost.
  - You are about to drop the column `files` on the `Resource` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `Resource` table. All the data in the column will be lost.
  - You are about to drop the column `links` on the `Resource` table. All the data in the column will be lost.
  - You are about to drop the column `videos` on the `Resource` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'COMPLETE', 'UNCOMPLETE', 'LATER');

-- AlterTable
ALTER TABLE "Resource" DROP COLUMN "body",
DROP COLUMN "files",
DROP COLUMN "images",
DROP COLUMN "links",
DROP COLUMN "videos";

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "resourceId" INTEGER NOT NULL,
    "parentTaskId" INTEGER,
    "expectedDuration" TEXT NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskUserStatus" (
    "id" SERIAL NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'UNCOMPLETE',
    "taskId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "TaskUserStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionLinks" (
    "id" SERIAL NOT NULL,
    "link" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "taskId" INTEGER NOT NULL,

    CONSTRAINT "QuestionLinks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileLinks" (
    "id" SERIAL NOT NULL,
    "link" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "taskId" INTEGER NOT NULL,

    CONSTRAINT "FileLinks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImageLinks" (
    "id" SERIAL NOT NULL,
    "link" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "taskId" INTEGER NOT NULL,

    CONSTRAINT "ImageLinks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoLinks" (
    "id" SERIAL NOT NULL,
    "link" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "taskId" INTEGER NOT NULL,

    CONSTRAINT "VideoLinks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebsiteLinks" (
    "id" SERIAL NOT NULL,
    "link" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "taskId" INTEGER NOT NULL,

    CONSTRAINT "WebsiteLinks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_parentTaskId_fkey" FOREIGN KEY ("parentTaskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskUserStatus" ADD CONSTRAINT "TaskUserStatus_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskUserStatus" ADD CONSTRAINT "TaskUserStatus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionLinks" ADD CONSTRAINT "QuestionLinks_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileLinks" ADD CONSTRAINT "FileLinks_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageLinks" ADD CONSTRAINT "ImageLinks_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoLinks" ADD CONSTRAINT "VideoLinks_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebsiteLinks" ADD CONSTRAINT "WebsiteLinks_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
