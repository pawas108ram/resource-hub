-- CreateEnum
CREATE TYPE "QuestionTag" AS ENUM ('Array', 'String', 'Searching', 'Sorting', 'Graph', 'Tree', 'DynamicProgramming', 'Greedy', 'Backtracking', 'BitManipulation', 'Math', 'Geometry', 'GameTheory', 'DataStructure', 'Hashing', 'Stack', 'Queue', 'Heap', 'LinkedList', 'BinarySearchTree', 'BinaryIndexedTree', 'SegmentTree', 'Trie', 'DisjointSet', 'FenwickTree', 'GraphTheory', 'ShortestPath', 'MinimumSpanningTree', 'TopologicalSort', 'EulerianPath', 'BipartiteGraph', 'FlowNetwork', 'NetworkFlow', 'MaximumFlow', 'MinCut', 'MaxCut', 'Matching', 'HopcroftKarp', 'Dinic', 'EdmondsKarp', 'FordFulkerson', 'BellmanFord', 'FloydWarshall', 'Dijkstra', 'Johnson', 'Prim', 'Kruskal', 'Tarjan', 'Kosaraju', 'SuffixArray', 'SuffixTree', 'LCPArray', 'ZAlgorithm', 'KMPAlgorithm', 'RabinKarp', 'Other');

-- CreateEnum
CREATE TYPE "ResouceTag" AS ENUM ('DataStructure', 'WebDevelopment', 'MachineLearning', 'DeepLearning', 'ArtificialIntelligence', 'CompetitiveProgramming', 'SystemDesign', 'OperatingSystem', 'Database', 'Networking', 'Array', 'String', 'Searching', 'Sorting', 'Graph', 'Tree', 'DynamicProgramming', 'Greedy', 'Backtracking', 'BitManipulation', 'Math', 'Geometry', 'GameTheory', 'Hashing', 'Stack', 'Queue', 'Heap', 'LinkedList', 'BinarySearchTree', 'BinaryIndexedTree', 'SegmentTree', 'Trie', 'DisjointSet', 'FenwickTree', 'GraphTheory', 'ShortestPath', 'MinimumSpanningTree', 'TopologicalSort', 'EulerianPath', 'BipartiteGraph', 'FlowNetwork', 'NetworkFlow', 'MaximumFlow', 'MinCut', 'MaxCut', 'Matching', 'HopcroftKarp', 'Dinic', 'EdmondsKarp', 'FordFulkerson', 'BellmanFord', 'FloydWarshall', 'Dijkstra', 'Johnson', 'Prim', 'Kruskal', 'Tarjan', 'Kosaraju', 'SuffixArray', 'SuffixTree', 'LCPArray', 'ZAlgorithm', 'KMPAlgorithm', 'RabinKarp', 'Other');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT,
    "hashedPassword" TEXT,
    "bio" TEXT,
    "portfolio" TEXT,
    "email" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "profileLink" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" TEXT,
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
    "url" TEXT,

    CONSTRAINT "Sheet_pkey" PRIMARY KEY ("id")
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
    "url" TEXT,
    "tags" "ResouceTag"[],
    "images" TEXT[],
    "links" TEXT[],
    "videos" TEXT[],

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Request" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "body" TEXT,
    "requesteeId" INTEGER NOT NULL,
    "sheetId" INTEGER NOT NULL,
    "requestorId" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
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

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserReplies" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "commentId" INTEGER NOT NULL,

    CONSTRAINT "UserReplies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "dislikes" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,
    "tags" "QuestionTag"[],
    "body" TEXT NOT NULL,
    "sheetId" INTEGER NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Solution" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "dislikes" INTEGER NOT NULL DEFAULT 0,
    "body" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "images" TEXT[],
    "video" TEXT[],
    "questionId" INTEGER NOT NULL,

    CONSTRAINT "Solution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_profileLink_key" ON "User"("profileLink");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sheet" ADD CONSTRAINT "Sheet_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE "Request" ADD CONSTRAINT "Request_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "Sheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_requesteeId_fkey" FOREIGN KEY ("requesteeId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_requestorId_fkey" FOREIGN KEY ("requestorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE "UserReplies" ADD CONSTRAINT "UserReplies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserReplies" ADD CONSTRAINT "UserReplies_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "Sheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solution" ADD CONSTRAINT "Solution_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
