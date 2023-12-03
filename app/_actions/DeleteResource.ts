import toast from "react-hot-toast";

export const DeleteResource=async(id: number)=> {
    await fetch('/api/resources/' + id, {
        method: 'DELETE',
    } ).then(()=>toast.success('Resource Deleted')).catch((error)=>toast.error('There was a error in deleting the resource'));
    
}