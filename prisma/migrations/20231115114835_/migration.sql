/*
  Warnings:

  - Added the required column `accessType` to the `Solution` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language` to the `Solution` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AccessType" AS ENUM ('Public', 'Private', 'Protected');

-- CreateEnum
CREATE TYPE "Languages" AS ENUM ('C', 'Cpp', 'Java', 'Python', 'Javascript', 'Typescript', 'Golang', 'Rust', 'Kotlin', 'Swift', 'Scala', 'Haskell', 'Clojure', 'Lua', 'Perl', 'R', 'Ruby', 'Bash', 'PHP', 'Other');

-- AlterTable
ALTER TABLE "Solution" ADD COLUMN     "accessType" "AccessType" NOT NULL,
ADD COLUMN     "language" "Languages" NOT NULL;
