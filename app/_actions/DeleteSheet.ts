import toast from "react-hot-toast";

export const DeleteSheet=async(id: number)=> {
    await fetch('/api/sheets/' + id, {
        method: 'DELETE',
    } ).then(()=>toast.success('Sheet Deleted')).catch((error)=>toast.error('There was a error in deleting the sheet'));
    
}