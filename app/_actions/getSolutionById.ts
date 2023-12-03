import { baseUrl } from "./getAllSolutions";

export const getSolutionById=async(solutionId: string)=> {
    const url=baseUrl();
    const res = await fetch(`${url}/api/solution/singleSolution/${solutionId}`);
    if (res.status === 200) {
        const solution = await res.json();
        return solution;
    }
    else {
        return null;
    }
}