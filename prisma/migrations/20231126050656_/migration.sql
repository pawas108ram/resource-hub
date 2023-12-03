/*
  Warnings:

  - The `tags` column on the `Resource` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ResourceTag" AS ENUM ('DataStructure', 'WebDevelopment', 'MachineLearning', 'DeepLearning', 'ArtificialIntelligence', 'CompetitiveProgramming', 'SystemDesign', 'OperatingSystem', 'Database', 'Networking', 'Array', 'String', 'Searching', 'Sorting', 'Graph', 'Tree', 'DynamicProgramming', 'Greedy', 'Backtracking', 'BitManipulation', 'Math', 'Geometry', 'GameTheory', 'Hashing', 'Stack', 'Queue', 'Heap', 'LinkedList', 'BinarySearchTree', 'BinaryIndexedTree', 'SegmentTree', 'Trie', 'DisjointSet', 'FenwickTree', 'GraphTheory', 'ShortestPath', 'MinimumSpanningTree', 'TopologicalSort', 'EulerianPath', 'BipartiteGraph', 'FlowNetwork', 'NetworkFlow', 'MaximumFlow', 'MinCut', 'MaxCut', 'Matching', 'HopcroftKarp', 'Dinic', 'EdmondsKarp', 'FordFulkerson', 'BellmanFord', 'FloydWarshall', 'Dijkstra', 'Johnson', 'Prim', 'Kruskal', 'Tarjan', 'Kosaraju', 'SuffixArray', 'SuffixTree', 'LCPArray', 'ZAlgorithm', 'KMPAlgorithm', 'RabinKarp', 'Other');

-- AlterTable
ALTER TABLE "Resource" DROP COLUMN "tags",
ADD COLUMN     "tags" "ResourceTag"[];

-- DropEnum
DROP TYPE "ResouceTag";
