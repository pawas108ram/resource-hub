import { baseUrlGiver } from "./getQuestionById";


export const getSolutionById = async (solutionId: string) => {
    const baseUrl = baseUrlGiver();
    
    const res = await fetch(`${baseUrl}/api/solution/singleSolution/${solutionId}`);
    if (res.status === 200) {
        const solution = await res.json();
        return solution;
    }
    else {
        return null;
    }
}