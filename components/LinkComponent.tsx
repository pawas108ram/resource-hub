'use client'
import React, { useState } from 'react'
import { MdClose } from 'react-icons/md';

const LinkComponent = ({ ind, link,setLinks }: { ind: number, link: string,setLinks:React.Dispatch<React.SetStateAction<string[]>> }) => {
    const [showLink,setShowLink] = useState<boolean>(false);
  return (
      <div>
            <div key={`link/${ind}`} className='flex flex-row items-center gap-1 rounded bg-white/10 text-blue-500 p-2 lg:text-sm xs:text-xs      '>
                                <span className='xs:hidden lg:flex '>{link}</span>
                                <div className="relative ">
                                    <span className='xs:flex lg:hidden  ' onClick={() => setShowLink((prev)=>!prev)}>Link {ind + 1}</span>
                                    {showLink && <span className='-top-10 -right-10  p-1 rounded  w-[200px] absolute bg-black/60 flex flex-row items-center justify-center '>
                                        <span className='w-full truncatestyle-1'>{link}</span>
                                        
                                    </span>}
                                </div>
                                
                                <button className='bg-red-500 p-1 rounded-full hover:scale-105 hover:bg-red-600 transition duration-300' type='button' onClick={()=>setLinks((prev)=>prev.filter((l)=>l!==link))}><MdClose/></button>
                            </div>
      
    </div>
  )
}

export default LinkComponent
