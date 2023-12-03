'use client'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import Loader from '../Loader';
import { MdClose } from 'react-icons/md';

const StoreRedirectModal = ({onClose,currentUserKeys,keysNeeded,isSheet}:{onClose:()=>void,currentUserKeys:number,keysNeeded:number,isSheet:boolean}) => {
    const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleBuy = () => {
    setLoading(true);
    router.push('/store');
    onClose();
  }
    
  return (
      <div className='fixed inset-0 bg-black/40 flex flex-row items-center justify-center z-[999999]'>
          <div className='p-4 lg:w-2/5 xs:w-3/5 flex flex-col gap-2 bg-white rounded relative text-black'>
              {loading ? <div className="flex flex-col gap-1 bg-black items-center justify-center p-4">
                  <Loader />
                  <span className='text-white text-xl font-semibold'>Redirecting to Store...</span>
              </div> : <><button className='absolute -right-5 -top-5 bg-red-600 p-3 rounded-full' onClick={() => onClose()}><MdClose /></button>
              <span className='text-center lg:text-2xl xs:text-sm font-semibold'>You need to buy keys to access this sheet need {keysNeeded - currentUserKeys} keys more!!</span>
              <div className="flex flex-row items-center gap-2 w-full justify-center">
                  <button className='bg-red-500 py-2 px-4 rounded text-white' onClick={() => onClose()}>Return to { isSheet?'Sheets':'Resources'}</button>
                  <button className='bg-green-500 py-2 px-4 rounded text-white' onClick={()=>handleBuy()
               
               
               

                
                          
                  }>Buy Keys</button></div></>}
              
              
          </div>
      
    </div>
  )
}

export default StoreRedirectModal
