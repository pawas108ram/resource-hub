import React from 'react'
import SubHeading from '../SubHeading'
import { PublishStatus } from '@prisma/client'
import { MdClose } from 'react-icons/md'
import { Check } from 'lucide-react'
import toast from 'react-hot-toast'

const PublishStatusModal = ({ onClose, sheetId, resourceId, status }: { onClose: () => void, sheetId?: number, resourceId?: number, status: PublishStatus }) => {
    const handlePublishStatus = async () => {
        if (sheetId) {
            const res = await fetch('/api/sheets/publish', {
                method: 'PUT',
                body: JSON.stringify({
                    sheetId,
                    
                    status: status === 'PUBLISHED' ? 'UNPUBLISHED' : 'PUBLISHED'
                })
            })
            if (res.ok) {
                toast.success(`Sheet ${status === 'PUBLISHED' ? 'UnPublished' : 'Published'} Successfully`)
                onClose();
            }
            else {
                toast.error(`Sheet ${status === 'PUBLISHED' ? 'UnPublishing' : 'Publishing'} Failed`)
            }
        }
        if(resourceId){
            const res = await fetch('/api/resources/publish', {
                method: 'PUT',
                body: JSON.stringify({
                    resourceId,
                    
                    status: status === 'PUBLISHED' ? 'UNPUBLISHED' : 'PUBLISHED'
                })
            })
            if (res.ok) {
                toast.success(`Resource ${status === 'PUBLISHED' ? 'UnPublished' : 'Published'} Successfully`)
                onClose();
            }
            else {
                toast.error(`Resource ${status === 'PUBLISHED' ? 'UnPublishing' : 'Publishing'} Failed`)
            }
        }
    }
  return (
      <div className='flex flex-row items-center justify-center bg-black/60 fixed inset-0 z-[999999]'>
          <div className='lg:w-3/5 xs:w-4/5 bg-white p-2 rounded flex flex-col items-center gap-2 relative'>
                <button className='absolute -top-5 -right-5 text-white bg-red-500 rounded-full p-3' onClick={onClose}><MdClose size={20} /></button>
              <SubHeading body='Publish Status' className='underline' />
              <span className='lg:text-xl xs:text-sm font-semibold'>Are you Sure you want to {status === 'PUBLISHED' ? 'Unpublish' : 'Publish'} your {resourceId===null ? 'Sheet' : 'Resource'} ???</span>
              <div className='flex flex-row items-center justify-center gap-4'>
                  <button className='py-3 px-4 rounded bg-red-500 text-white font-semibold ' onClick={()=>onClose()}><MdClose /></button>
                    <button className='py-2 px-4 rounded bg-green-500 text-white font-semibold ' onClick={()=>handlePublishStatus()}><Check /></button>
              </div>

              
          </div>
      
    </div>
  )
}

export default PublishStatusModal
