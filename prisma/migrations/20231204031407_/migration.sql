-- CreateEnum
CREATE TYPE "PublishStatus" AS ENUM ('UNPUBLISHED', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'COMPLETE', 'UNCOMPLETE', 'LATER');

-- CreateEnum
CREATE TYPE "QuestionStatus" AS ENUM ('UNATTEMPTED', 'REVISED', 'SOLVED', 'SKIPPED');

-- CreateEnum
CREATE TYPE "AccessType" AS ENUM ('Public', 'Private', 'Protected');

-- CreateEnum
CREATE TYPE "SolutionType" AS ENUM ('BruteForce', 'Optimal', 'Optimum');

-- CreateEnum
CREATE TYPE "Languages" AS ENUM ('C', 'Cpp', 'Java', 'Python', 'Javascript', 'Typescript', 'Golang', 'Rust', 'Kotlin', 'Swift', 'Scala', 'Haskell', 'Clojure', 'Lua', 'Perl', 'R', 'Ruby', 'Bash', 'PHP', 'Other');

-- CreateEnum
CREATE TYPE "QuestionTag" AS ENUM ('Array', 'String', 'Searching', 'Sorting', 'Graph', 'Tree', 'DynamicProgramming', 'Greedy', 'Backtracking', 'BitManipulation', 'Math', 'Geometry', 'GameTheory', 'DataStructure', 'Hashing', 'Stack', 'Queue', 'Heap', 'LinkedList', 'BinarySearchTree', 'BinaryIndexedTree', 'SegmentTree', 'Trie', 'DisjointSet', 'FenwickTree', 'GraphTheory', 'ShortestPath', 'MinimumSpanningTree', 'TopologicalSort', 'EulerianPath', 'BipartiteGraph', 'FlowNetwork', 'NetworkFlow', 'MaximumFlow', 'MinCut', 'MaxCut', 'Matching', 'HopcroftKarp', 'Dinic', 'EdmondsKarp', 'FordFulkerson', 'BellmanFord', 'FloydWarshall', 'Dijkstra', 'Johnson', 'Prim', 'Kruskal', 'Tarjan', 'Kosaraju', 'SuffixArray', 'SuffixTree', 'LCPArray', 'ZAlgorithm', 'KMPAlgorithm', 'RabinKarp', 'BinarySearch', 'SlidingWindow', 'TwoPointer', 'DivideAndConquer', 'Recursion', 'Memoization', 'NumberTheory', 'SieveOfEratosthenes', 'Other');

-- CreateEnum
CREATE TYPE "ResourceTag" AS ENUM ('DataStructure', 'WebDevelopment', 'MachineLearning', 'DeepLearning', 'ArtificialIntelligence', 'CompetitiveProgramming', 'SystemDesign', 'OperatingSystem', 'Database', 'Networking', 'Array', 'String', 'Searching', 'Sorting', 'Graph', 'Tree', 'DynamicProgramming', 'Greedy', 'Backtracking', 'BitManipulation', 'Math', 'Geometry', 'GameTheory', 'Hashing', 'Stack', 'Queue', 'Heap', 'LinkedList', 'BinarySearchTree', 'BinaryIndexedTree', 'SegmentTree', 'Trie', 'DisjointSet', 'FenwickTree', 'GraphTheory', 'ShortestPath', 'MinimumSpanningTree', 'TopologicalSort', 'EulerianPath', 'BipartiteGraph', 'FlowNetwork', 'NetworkFlow', 'MaximumFlow', 'MinCut', 'MaxCut', 'Matching', 'HopcroftKarp', 'Dinic', 'EdmondsKarp', 'FordFulkerson', 'BellmanFord', 'FloydWarshall', 'Dijkstra', 'Johnson', 'Prim', 'Kruskal', 'Tarjan', 'Kosaraju', 'SuffixArray', 'SuffixTree', 'LCPArray', 'ZAlgorithm', 'KMPAlgorithm', 'RabinKarp', 'Other');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('Recruit', 'Veteran', 'Elite', 'Legendary');

-- CreateEnum
CREATE TYPE "Complexity" AS ENUM ('Constant', 'Logarithmic', 'Linear', 'Quadratic', 'Cubic', 'Exponential', 'Factorial', 'Other');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "hashedPassword" TEXT,
    "bio" TEXT,
    "portfolio" TEXT,
    "email" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "profileLink" TEXT NOT NULL,
    "coins" INTEGER NOT NULL DEFAULT 400,
    "keys" INTEGER NOT NULL DEFAULT 3,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SheetDislikes" (
    "id" SERIAL NOT NULL,
    "sheetId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "SheetDislikes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResourceDislikes" (
    "id" SERIAL NOT NULL,
    "resourceId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ResourceDislikes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sheet" (
    "id" SERIAL NOT NULL,
    "authorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "keys" INTEGER,
    "status" "PublishStatus" NOT NULL DEFAULT 'UNPUBLISHED',

    CONSTRAINT "Sheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Folder" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "sheetId" INTEGER NOT NULL,

    CONSTRAINT "Folder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SheetLikes" (
    "id" SERIAL NOT NULL,
    "sheetId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "SheetLikes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SheetUser" (
    "id" SERIAL NOT NULL,
    "sheetId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "SheetUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResourceUser" (
    "id" SERIAL NOT NULL,
    "resourceId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ResourceUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resource" (
    "id" SERIAL NOT NULL,
    "authorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "tags" "ResourceTag"[],
    "instructions" TEXT[],
    "keys" INTEGER,
    "status" "PublishStatus" NOT NULL DEFAULT 'UNPUBLISHED',

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "resourceId" INTEGER NOT NULL,
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

-- CreateTable
CREATE TABLE "ResourceLikes" (
    "id" SERIAL NOT NULL,
    "resourceId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ResourceLikes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "body" TEXT,
    "authorId" INTEGER NOT NULL,
    "sheetId" INTEGER,
    "resourceId" INTEGER,
    "questionId" INTEGER,
    "solutionId" INTEGER,
    "parentId" INTEGER,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentLikes" (
    "id" SERIAL NOT NULL,
    "commentId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "CommentLikes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentDislikes" (
    "id" SERIAL NOT NULL,
    "commentId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "CommentDislikes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "tags" "QuestionTag"[],
    "links" TEXT[],
    "sheetId" INTEGER,
    "difficulty" "Difficulty" NOT NULL DEFAULT 'Recruit',
    "folderId" INTEGER,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionUserStatus" (
    "id" SERIAL NOT NULL,
    "status" "QuestionStatus" NOT NULL DEFAULT 'UNATTEMPTED',
    "questionId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "QuestionUserStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionLikes" (
    "id" SERIAL NOT NULL,
    "questionId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "QuestionLikes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionDislikes" (
    "id" SERIAL NOT NULL,
    "questionId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "QuestionDislikes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Solution" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "body" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "images" TEXT[],
    "video" TEXT[],
    "questionId" INTEGER NOT NULL,
    "type" "SolutionType" NOT NULL,
    "language" "Languages" NOT NULL,
    "accessType" "AccessType" NOT NULL,
    "authorId" INTEGER NOT NULL,
    "timeComplexity" "Complexity" NOT NULL DEFAULT 'Constant',
    "spaceComplexity" "Complexity" NOT NULL DEFAULT 'Constant',

    CONSTRAINT "Solution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SolutionViews" (
    "id" SERIAL NOT NULL,
    "solutionId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "SolutionViews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SolutionLikes" (
    "id" SERIAL NOT NULL,
    "solutionId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "SolutionLikes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SolutionDislikes" (
    "id" SERIAL NOT NULL,
    "solutionId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "SolutionDislikes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_profileLink_key" ON "User"("profileLink");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- AddForeignKey
ALTER TABLE "SheetDislikes" ADD CONSTRAINT "SheetDislikes_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "Sheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SheetDislikes" ADD CONSTRAINT "SheetDislikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceDislikes" ADD CONSTRAINT "ResourceDislikes_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceDislikes" ADD CONSTRAINT "ResourceDislikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sheet" ADD CONSTRAINT "Sheet_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "Sheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SheetLikes" ADD CONSTRAINT "SheetLikes_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "Sheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SheetLikes" ADD CONSTRAINT "SheetLikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SheetUser" ADD CONSTRAINT "SheetUser_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "Sheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SheetUser" ADD CONSTRAINT "SheetUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceUser" ADD CONSTRAINT "ResourceUser_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceUser" ADD CONSTRAINT "ResourceUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "ResourceLikes" ADD CONSTRAINT "ResourceLikes_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceLikes" ADD CONSTRAINT "ResourceLikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "Sheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "Solution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentLikes" ADD CONSTRAINT "CommentLikes_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentLikes" ADD CONSTRAINT "CommentLikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentDislikes" ADD CONSTRAINT "CommentDislikes_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentDislikes" ADD CONSTRAINT "CommentDislikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "Sheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionUserStatus" ADD CONSTRAINT "QuestionUserStatus_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionUserStatus" ADD CONSTRAINT "QuestionUserStatus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionLikes" ADD CONSTRAINT "QuestionLikes_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionLikes" ADD CONSTRAINT "QuestionLikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionDislikes" ADD CONSTRAINT "QuestionDislikes_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionDislikes" ADD CONSTRAINT "QuestionDislikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solution" ADD CONSTRAINT "Solution_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solution" ADD CONSTRAINT "Solution_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolutionViews" ADD CONSTRAINT "SolutionViews_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "Solution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolutionViews" ADD CONSTRAINT "SolutionViews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolutionLikes" ADD CONSTRAINT "SolutionLikes_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "Solution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolutionLikes" ADD CONSTRAINT "SolutionLikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolutionDislikes" ADD CONSTRAINT "SolutionDislikes_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "Solution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolutionDislikes" ADD CONSTRAINT "SolutionDislikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
