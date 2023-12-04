

export const getSolutionById=async(solutionId: string)=> {
    
    const res = await fetch(`/api/solution/singleSolution/${solutionId}`);
    if (res.status === 200) {
        const solution = await res.json();
        return solution;
    }
    else {
        return null;
    }
}