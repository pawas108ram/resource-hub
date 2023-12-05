
'use client'
import React, { useState } from 'react'
import { MdClose } from 'react-icons/md'
import Heading from '../Heading'
import { FilterType, FilterOptions } from './FilterSolutionModal';
import Select from 'react-select';
import { useRouter } from 'next/navigation';



const FilterSheetModal = ({ onClose }: { onClose: () => void }) => {
    const [authorName, setAuthorName] = useState<string>('');
    const [createdAt, setCreatedAt] = useState<{value:FilterType,label:string} | null>(null);
    const [updatedAt, setUpdatedAt] = useState<{value:FilterType,label:string} | null>(null);
    const [likes, setLikes] = useState<{value:FilterType,label:string}| null>(null);
   
    const [users, setUsers] = useState<{value:FilterType,label:string} | null>(null);
    const [request, setRequest] = useState<{value:FilterType,label:string} | null>(null);
    const [comments, setComments] = useState<{value:FilterType,label:string} | null>(null);
    const [questions, setQuestions] = useState<{ value: FilterType, label: string } | null>(null);
    const router = useRouter();
    const handleFilterChange = () => {
       
        let url = `/sheet`;
        
    
        const queryParams = [];
    
        // Add each defined query parameter to the array
        if (authorName) {
            queryParams.push(`author=${encodeURIComponent(authorName)}`);
        }
    
        if (createdAt && createdAt.value) {
            queryParams.push(`createdAt=${encodeURIComponent(createdAt.value.toString())}`);
        }
    
        if (updatedAt && updatedAt.value) {
            queryParams.push(`updatedAt=${encodeURIComponent(updatedAt.value.toString())}`);
        }
    
        if (likes && likes.value) {
            queryParams.push(`likes=${encodeURIComponent(likes.value.toString())}`);
        }
    
        if (users && users.value) {
            queryParams.push(`users=${encodeURIComponent(users.value.toString())}`);
        }
    
        if (comments && comments.value) {
            queryParams.push(`comments=${encodeURIComponent(comments.value.toString())}`);
        }
    
        if (questions && questions.value) {
            queryParams.push(`questions=${encodeURIComponent(questions.value.toString())}`);
        }
    
        if (request && request.value) {
            queryParams.push(`request=${encodeURIComponent(request.value.toString())}`);
        }
    
        // Concatenate the query parameters array to the URL if there are any
        if (queryParams.length > 0) {
            url += `/?${queryParams.join('&')}`;
        }
    
        
        router.push(url);
        onClose();
    };
    

    
  return (
      <div className='fixed inset-0 bg-black/30 z-[99999] flex flex-row items-center justify-center'>
          <div className='lg:w-3/5 xs:w-5/6 bg-black/90  p-4 rounded relative flex flex-col gap-3 xs:h-4/6  '>
              <button onClick={onClose} className='bg-red-500 -top-5 -right-5 p-4 rounded-full absolute'><MdClose /></button>
              <Heading body='Filter Sheets' className='text-center text-white ' />
              <div className='grid xs:gap-0.5 xs:grid-cols-1 lg:gap-2 lg:grid-cols-2  p-2 rounded bg-black w-full xs:h-full overflow-y-auto'>
                  <div className='flex flex-col gap-1 col-span-1  '>
                        <span className='lg:text-lg xs:text-sm font-semibold'>Author Name</span>
                        <input type="text" value={authorName} onChange={(e) => setAuthorName(e.target.value)} className=' rounded  form-input py-1.5' placeholder='Enter Author name' />
                  </div>
                  <div className='flex flex-col gap-1  '>
                        <span className='lg:text-lg xs:text-sm font-semibold'>Filter By Created At </span>
                        <Select options={FilterOptions} value={createdAt} onChange={(e:any)=>setCreatedAt(e)} isClearable maxMenuHeight={150} placeholder='Select Created At Filter'  />
                  </div>
                  <div className='flex flex-col gap-1  '>
                        <span className='lg:text-lg xs:text-sm font-semibold'>Filter By Updated At </span>
                        <Select options={FilterOptions} value={updatedAt} onChange={(e:any)=>setUpdatedAt(e)} isClearable maxMenuHeight={150} placeholder='Select updated At Filter' />
                  </div>
                  <div className='flex flex-col gap-1  '>
                        <span className='lg:text-lg xs:text-sm font-semibold'>Filter By Likes Count  </span>
                        <Select options={FilterOptions} value={likes} onChange={(e:any)=>setLikes(e)} isClearable maxMenuHeight={150} placeholder='Select likes count Filter'  />
                  </div>
                  <div className='flex flex-col gap-1  '>
                        <span className='lg:text-lg xs:text-sm font-semibold'>Filter By Users Count  </span>
                        <Select options={FilterOptions} value={users} onChange={(e:any)=>setUsers(e)} isClearable maxMenuHeight={150} placeholder='Select users count filter ' />
                  </div>
                  <div className='flex flex-col gap-1  '>
                        <span className='lg:text-lg xs:text-sm font-semibold'>Filter By Request Count  </span>
                        <Select options={FilterOptions} value={request} onChange={(e:any)=>setRequest(e)} isClearable maxMenuHeight={150} placeholder='Select requests count filter '  />
                  </div>
                  <div className='flex flex-col gap-1  '>
                        <span className='lg:text-lg xs:text-sm font-semibold'>Filter By Comments Count   </span>
                        <Select options={FilterOptions} value={comments} onChange={(e:any)=>setComments(e)} isClearable maxMenuHeight={150} placeholder='Select comments count filter '  />
                  </div>
                  <div className='flex flex-col gap-1  '>
                        <span className='lg:text-lg xs:text-sm font-semibold'>Filter By Questions Count  </span>
                        <Select options={FilterOptions} value={questions} onChange={(e:any)=>setQuestions(e)} isClearable maxMenuHeight={150} placeholder='Select questions count filter' />
                  </div>
              </div>
              <button className='bg-blue-500 py-3 px-6 rounded text-white font-semibold self-center ' onClick={()=>handleFilterChange()} >Apply Filters</button>

          </div>
      
    </div>
  )
}

export default FilterSheetModal
