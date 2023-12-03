-- CreateEnum
CREATE TYPE "Complexity" AS ENUM ('Constant', 'Logarithmic', 'Linear', 'Quadratic', 'Cubic', 'Exponential', 'Factorial', 'Other');

-- AlterTable
ALTER TABLE "Solution" ADD COLUMN     "spaceComplexity" "Complexity" NOT NULL DEFAULT 'Constant',
ADD COLUMN     "timeComplexity" "Complexity" NOT NULL DEFAULT 'Constant';
