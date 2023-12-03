import toast from "react-hot-toast";

export const  DeleteFolder=async(id: number)=> {
     await fetch(`/api/folders/delete/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(()=>toast.success('Folder Deleted')).catch((error)=>toast.error('There was a error in deleting the folder'));

}