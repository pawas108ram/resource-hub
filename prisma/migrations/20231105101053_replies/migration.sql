-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "parentId" DROP NOT NULL,
ALTER COLUMN "parentId" DROP DEFAULT;
DROP SEQUENCE "Comment_parentId_seq";
