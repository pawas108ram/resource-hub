import React from 'react'
import SubHeading from '../SubHeading'
import { MdClose } from 'react-icons/md'
import { Ban, Check } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'


const AcceptRequestModal = ({ onClose, requestId ,requestMakerId ,sheetId,resourceId }: { onClose: () => void, requestId: number ,requestMakerId:number,sheetId?:number,resourceId?:number }) => {
  const handleAccept = () => {
    
    if (sheetId) {
    
      axios.post(`/api/request/accept`, {
        requestId,
        requestMakerId,
        sheetId
      
      }).then((res) => toast.success(res.data)).catch((err) => toast.error(err.response.data)).finally(() => onClose())
    }
    if (resourceId) {
      axios.post(`/api/request/accept`, {
        requestId,
        requestMakerId,
        resourceId
      
      }).then((res) => toast.success(res.data)).catch((err) => toast.error(err.response.data)).finally(() => onClose())
    }
    
  }
  return (
    <div className='fixed inset-0 bg-black/40 z-40 flex flex-row items-center justify-center'> 
      <div className='bg-white p-4 rounded max-w-md w-full flex flex-col gap-2 relative'>
        <button className='absolute -right-5 -top-5 bg-red-600 p-3 rounded-full' onClick={onClose}><MdClose/></button>
        <SubHeading body='Accept Request ???' className='text-center' />
        <div className='flex flex-row items-center justify-center gap-4 w-full'>
          <button onClick={handleAccept} className='bg-green-500 py-2 px-4 rounded'><Check /></button>
          <button onClick={() => onClose()} className='bg-red-500 py-2 px-4 rounded'><Ban /></button>
        </div>
      </div>
      
    </div>
  )
}

export default AcceptRequestModal
