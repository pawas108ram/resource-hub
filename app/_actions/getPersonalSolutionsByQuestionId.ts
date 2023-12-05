export const getSolutionsByQuestionId = async (questionId: number) => {
    
    const res = await fetch(`/api/solution/${questionId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
            
    });
    if (res.status === 200) {
        return res.json();
    }
    else {
        return null;
    }
}