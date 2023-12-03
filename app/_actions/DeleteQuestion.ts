import toast from "react-hot-toast";

export  const  DeleteQuestion=async(id: number)=> {
    await fetch(`/api/questions/delete/${id}` , {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    } ).then(()=>toast.success('Question Deleted')).catch((error)=>toast.error('There was a error in deleting the question'));
    
}