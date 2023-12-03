'use client'
import { programmingLanguages } from '@/app/libs/const/languages';
import { Languages } from '@prisma/client'
import React, { useState } from 'react'
import { MdClose } from 'react-icons/md'
import SubHeading from '../SubHeading';
import Select from 'react-select';
import { useRouter } from 'next/navigation';
export type FilterType = 'asc' | 'desc' | '';

export const FilterOptions = [
    { value: 'asc', label: 'Ascending' },
    { value: 'desc', label: 'Descending' },
    
]

const FilterSolutionModal = ({ onClose,sheetId,questionId }: { onClose: () => void,sheetId:string,questionId:string }) => {
    const [language, setLanguage] = useState<{ value: Languages, label:string} | null>(null);
    const [createdAt, setCreatedAt] = useState<{ value: FilterType, label: string } | null>(null);
    const [updatedAt, setUpdatedAt] = useState<{ value: FilterType, label: string } | null>(null);
    const [likes, setLikes] = useState<{ value: FilterType, label: string } | null>(null);
    const [seenBy, setSeenBy] = useState<{ value: FilterType, label: string } | null>(null);
    const [comments, setComments] = useState<{ value: FilterType, label: string } | null>(null);
    const router = useRouter();

    const handleFilterChange = () => {
        let url = `/question/${sheetId}/${questionId}/solutions/`;

const queryParams = [];

// Add each defined query parameter to the array
if (language) {
  queryParams.push(`language=${language.value}`);
}

if (createdAt) {
  queryParams.push(`createdAt=${createdAt.value}`);
}

if (updatedAt) {
  queryParams.push(`updatedAt=${updatedAt.value}`);
}

if (likes) {
  queryParams.push(`likes=${likes.value}`);
}

if (seenBy) {
  queryParams.push(`seenBy=${seenBy.value}`);
}

if (comments) {
  queryParams.push(`comments=${comments.value}`);
}

// Concatenate the query parameters array to the URL if there are any
if (queryParams.length > 0) {
  url += `?${queryParams.join('&')}`;
}

        router.push(url);
        onClose();
        
        
    }

   

    

  return (
    <div className='fixed inset-0 pointer-events-all bg-black/80 z-[9999] flex flex-row items-center justify-center  '>
          <div className='bg-black/70 p-4 rounded xs:w-4/5 lg:w-2/5 relative flex flex-col gap-4 py-12 z-[99999]  text-white'>
              <button className='bg-red-500 rounded-full p-3 -top-5 -right-5 absolute' onClick={() => onClose()}><MdClose /></button>
              <SubHeading body='Apply Filter Solutions' className='underline ' />
              
              <div className="grid grid-cols-2 gap-3 w-full">
              <div className="flex flex-col gap-1">
                  <label htmlFor="language" className=' text-xl font-semibold '>Language Filter</label>
                  
                  <Select options={programmingLanguages} value={language} onChange={(e:any)=>setLanguage(e)} className='text-black' isClearable id='language' placeholder='Select Language' maxMenuHeight={150}/>
              </div>
                  <div className="flex flex-col gap-1">
                      <label htmlFor="createdAt" className=' text-xl font-semibold '>Apply Filter By Created Date</label>
                      
                      <Select options={FilterOptions} value={createdAt} onChange={(e:any)=>setCreatedAt(e)} className='text-black'  isClearable id='createdAt'  maxMenuHeight={150}/>
                  </div>
                  <div className="flex flex-col gap-1">
                      <label htmlFor="updatedAt" className=' text-xl font-semibold '>Apply Filter By Updated Date</label>
                      
                      <Select options={FilterOptions} value={updatedAt} onChange={(e:any)=>setUpdatedAt(e)} className='text-black'  isClearable id='updatedAt'  maxMenuHeight={150}/>
                  </div>
                  <div className="flex flex-col gap-1">
                      <label htmlFor="likes" className=' text-xl font-semibold '>Likes Count Filter</label>
                      
                      <Select options={FilterOptions} value={likes} onChange={(e:any)=>setLikes(e)} className='text-black'  isClearable id='likes'  maxMenuHeight={150}/>
                  </div>
                  <div className="flex flex-col gap-1">
                      <label htmlFor="seenBy" className=' text-xl font-semibold '>Apply Seen Count Filter</label>
                      
                      <Select options={FilterOptions} value={seenBy} onChange={(e:any)=>setSeenBy(e)} className='text-black'  isClearable id='seenBy'  maxMenuHeight={150}/>
                  </div>
                  <div className="flex flex-col gap-1">
                      <label htmlFor="comments" className=' text-xl font-semibold '>Apply Comment Count Filter</label>
                      
                      <Select options={FilterOptions} value={comments} onChange={(e:any)=>setComments(e)} className='text-black'  isClearable id='comments'  maxMenuHeight={150}/>
                  </div>
              </div>
              <button className='bg-blue-500 py-3 px-6 rounded text-white font-semibold self-center ' onClick={()=>handleFilterChange()}>Apply Filters</button>
             
              
          </div>
          </div>
  )
}

export default FilterSolutionModal
