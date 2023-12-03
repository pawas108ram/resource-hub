import toast from "react-hot-toast";

export const  DeleteSolutionById=async(solutionId: number)=> {
    await fetch('/api/solution/delete/' + solutionId, {
        method: 'DELETE',
    } ).then(()=>toast.success('Solution Deleted')).catch(()=>toast.error('There was a error in deleting the resource'));
}