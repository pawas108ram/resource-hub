import { CircularProgress } from '@mui/material';
import React from 'react'
import { MdClose } from 'react-icons/md';
import CircularProgresswithLabel from '@mui/material/CircularProgress';
interface ProgressModalProps{
    onClose: () => void;
    unattempted: number;
    solved: number;
    skipped: number;
    revised: number;
}

const ProgressModal:React.FC<ProgressModalProps> = ({onClose,unattempted,solved,revised,skipped}) => {
  return (
      <div className='bg-black/60 inset-0 fixed flex flex-row items-center justify-center z-[999999] '>
          <div className='bg-black text-white  w-5/6 p-2 rounded relative '>
              <button className='absolute -top-2 -right-2 bg-red-500 rounded-full p-3 ' onClick={onClose}><MdClose /></button>
              <div className='grid grid-cols-1 gap-0.5 bg-white/10 px-4 py-2 rounded'>
                  <span className='underline font-semibold'>Your Progress</span>
              <div className='flex flex-row items-center gap-1 col-span-1 text-green-500 justify-between '>
                                  <span >Solved Questions</span>
                                  <span className=' inline-flex relative'>
                                      <CircularProgresswithLabel value={solved} variant='determinate' className='text-green-500' />
                                      <span className='absolute top-0 right-0 left-0 bottom-0 flex flex-row items-center justify-center text-xs '>{solved}%</span>
                                  </span>
                                  
                              </div>
                              <div className='flex flex-row items-center gap-1 col-span-1 text-red-500 justify-between'>
                                  <span >Unsolved Questions</span>
                                  <span className=' inline-flex relative'>
                                      <CircularProgresswithLabel value={unattempted} variant='determinate' className='text-red-500 ' />
                                      <span className='absolute top-0 right-0 left-0 bottom-0 flex flex-row items-center justify-center text-xs '>{unattempted}%</span>
                                  </span>
                              </div>
                              <div className='flex flex-row items-center gap-1 col-span-1 text-yellow-500 justify-between'>
                                  <span >Revised Questions</span>
                                  <span className=' inline-flex relative'>
                                      <CircularProgresswithLabel value={revised} variant='determinate' className='text-yellow-500' />
                                      <span className='absolute top-0 right-0 left-0 bottom-0 flex flex-row items-center justify-center text-xs '>{revised}%</span>
                                  </span>
                                  
                              </div>
                              <div className='flex flex-row items-center gap-1 col-span-1 text-orange-500 justify-between'>
                                  <span >Skipped Questions</span>
                                  <span className=' inline-flex relative'>
                                      <CircularProgresswithLabel value={skipped} variant='determinate' className='text-orange-500' />
                                      <span className='absolute top-0 right-0 left-0 bottom-0 flex flex-row items-center justify-center text-xs '>{skipped}%</span>
                                  </span>
                                  
                              </div>
                  
                  
              </div>
          </div>
      
    </div>
  )
}

export default ProgressModal
