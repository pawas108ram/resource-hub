-- CreateTable
CREATE TABLE "SolutionViews" (
    "id" SERIAL NOT NULL,
    "solutionId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "SolutionViews_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SolutionViews" ADD CONSTRAINT "SolutionViews_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "Solution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolutionViews" ADD CONSTRAINT "SolutionViews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
