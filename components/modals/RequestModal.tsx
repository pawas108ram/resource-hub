'use client'
import React, { useState } from 'react'
import SubHeading from '../SubHeading';



import toast from 'react-hot-toast';
import { MdCancel, MdClose } from 'react-icons/md';
import { Check } from 'lucide-react';
interface RequestModalProps{
    
    onClose: () => void;
    
  sheetId?: number;
  resourceId?: number;
  keysNeeded?: number;
  currentKeys?: number;

}






const RequestModal: React.FC<RequestModalProps> = ({ onClose, sheetId,resourceId ,keysNeeded,currentKeys}) => {
 
  const [loading,setLoading]=useState(false)
  
  const handleAccess = async () => {
    if (sheetId) {
      const buySheet = await fetch(`/api/sheets/keys`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sheetId, keysNeeded, currentKeys })
      });
      if(buySheet.ok){
        toast.success('Sheet Bought')
        onClose()
      }
      else{
        const text = await buySheet.text();
        toast.error(text);
      }
    }
    if (resourceId) {
      const buyResource = await fetch(`/api/resources/keys`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ resourceId, keysNeeded, currentKeys })
      });
      if(buyResource.ok){
        toast.success('Resource Bought')
        onClose()
      }
      else{
        const text = await buyResource.text();
        toast.error(text);
      }
    }
    
  }
  
  return (
    <div className='fixed z-[999999]  backdrop:blur-sm bg-black/60  inset-0 flex flex-row items-center justify-center'>
      <div className='lg:w-2/5 flex flex-col bg-white rounded p-4 xs:w-5/6 text-gray-900 gap-2 items-center relative'>
        <button className='absolute -right-5 -top-5 bg-red-600 p-3 rounded-full' onClick={onClose}><MdClose/></button>
        <SubHeading body={`Request for ${sheetId ? 'Sheet' : 'Resource'}`} className='text-center ' />
        <span className='bg-black/90 text-center text-white p-2 rounded lg:text-xl xs:text-sm'>Are You Sure you want to use {keysNeeded} pendrives from your {currentKeys} pendrives???</span>
        <div className='flex flex-row items-center gap-2'>
          <button onClick={() => onClose()} className='py-2 px-4 rounded bg-red-500 text-white '><MdCancel size={20} /></button>
          <button className='py-2 px-4 rounded bg-green-500 text-white ' onClick={()=>handleAccess()}><Check size={20}/></button>
        </div>
        
        
        
        
      </div>
          
      
    </div>
  )
}

export default RequestModal
