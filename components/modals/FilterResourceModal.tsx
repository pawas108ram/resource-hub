
'use client'
import React, { useState } from 'react'
import { MdClose } from 'react-icons/md'
import Heading from '../Heading'
import { FilterType, FilterOptions } from './FilterSolutionModal';
import Select from 'react-select';
import { useRouter } from 'next/navigation';
import { ResourceTag } from '@prisma/client';
import { resourceTypeOptions } from '@/app/libs/const/resourceTypeOptions';



const FilterResourceModal = ({ onClose,resourceFilterTags,setResourceFilterTags }: { onClose: () => void,resourceFilterTags: { value: ResourceTag, label: string }[], setResourceFilterTags: React.Dispatch<React.SetStateAction<{ value: ResourceTag, label: string }[]>>  }) => {
    const [authorName, setAuthorName] = useState<string>('');
    const [createdAt, setCreatedAt] = useState<{value:FilterType,label:string} | null>(null);
    const [updatedAt, setUpdatedAt] = useState<{value:FilterType,label:string} | null>(null);
    const [likes, setLikes] = useState<{value:FilterType,label:string}| null>(null);
   
    const [users, setUsers] = useState<{value:FilterType,label:string} | null>(null);
    const [request, setRequest] = useState<{value:FilterType,label:string} | null>(null);
    const [comments, setComments] = useState<{ value: FilterType, label: string } | null>(null);
    const [tags, setTags] = useState<{ value: ResourceTag, label: string }[]>(resourceFilterTags);
   
    const router = useRouter();
    const handleFilterChange = () => {
       
        let url = `/resource`;
        
    
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
    
      
    
        if (request && request.value) {
            queryParams.push(`request=${encodeURIComponent(request.value.toString())}`);
        }
    
        // Concatenate the query parameters array to the URL if there are any
        if (queryParams.length > 0) {
            url += `/?${queryParams.join('&')}`;
        }
        setResourceFilterTags(tags);
        setTags([]);
    
        
        router.push(url);
        onClose();
    };
    

    
  return (
      <div className='fixed inset-0 bg-black/30 z-[99999] flex flex-row items-center justify-center'>
          <div className='lg:w-3/5 bg-black  p-4 rounded relative flex flex-col gap-3 xs:w-5/6  '>
              <button onClick={onClose} className='bg-red-500 -top-5 -right-5 p-4 rounded-full absolute'><MdClose /></button>
              <Heading body='Filter Resources' className='text-center text-white ' />
              <div className='grid lg:gap-2 lg:grid-cols-2 xs:grid-cols-1 xs:gap-0.5  p-2 rounded bg-white/10 text-white  w-full'>
                  <div className='flex flex-col gap-1 col-span-1  '>
                        <span className='lg:text-lg xs:text-sm font-semibold'>Author Name</span>
                        <input type="text" value={authorName} onChange={(e) => setAuthorName(e.target.value)} className=' rounded  form-input bg-white/10 text-blue-600 ' placeholder='Enter Author name' />
                  </div>
                  <div className='flex flex-col gap-1  '>
                        <span className='lg:text-lg xs:text-sm font-semibold'>Filter By Created At </span>
                        <Select options={FilterOptions} value={createdAt} onChange={(e:any)=>setCreatedAt(e)} isClearable maxMenuHeight={150} placeholder='Select Created At Filter' className='text-black'  />
                  </div>
                  <div className='flex flex-col gap-1  '>
                        <span className='lg:text-lg xs:text-sm font-semibold'>Filter By Updated At </span>
                        <Select options={FilterOptions} value={updatedAt} onChange={(e:any)=>setUpdatedAt(e)} isClearable maxMenuHeight={150} placeholder='Select updated At Filter' className='text-black' />
                  </div>
                  <div className='flex flex-col gap-1  '>
                        <span className='lg:text-lg xs:text-sm font-semibold'>Filter By Likes Count  </span>
                        <Select options={FilterOptions} value={likes} onChange={(e:any)=>setLikes(e)} isClearable maxMenuHeight={150} placeholder='Select likes count Filter' className='text-black' />
                  </div>
                  <div className='flex flex-col gap-1  '>
                        <span className='lg:text-lg xs:text-sm font-semibold'>Filter By Users Count  </span>
                        <Select options={FilterOptions} value={users} onChange={(e:any)=>setUsers(e)} isClearable maxMenuHeight={150} placeholder='Select users count filter ' className='text-black' />
                  </div>
                  <div className='flex flex-col gap-1  '>
                        <span className='lg:text-lg xs:text-sm font-semibold'>Filter By Request Count  </span>
                        <Select options={FilterOptions} value={request} onChange={(e:any)=>setRequest(e)} isClearable maxMenuHeight={150} placeholder='Select requests count filter ' className='text-black'  />
                  </div>
                  <div className='flex flex-col gap-1  '>
                        <span className='lg:text-lg xs:text-sm font-semibold'>Filter By Comments Count   </span>
                        <Select options={FilterOptions} value={comments} onChange={(e:any)=>setComments(e)} isClearable maxMenuHeight={150} placeholder='Select comments count filter ' className='text-black' />
                  </div>
                    <div className='flex flex-col gap-1  '>
                            <span className='lg:text-lg xs:text-sm font-semibold'>Filter By Resource Type   </span>
                      <Select options={resourceTypeOptions} value={tags} onChange={(e: any) => setTags(e)} isMulti maxMenuHeight={150} placeholder='Select resource type filter ' className='text-black' />
                      </div>
                
              </div>
              <button className='bg-blue-500 py-3 px-6 rounded text-white font-semibold self-center ' onClick={()=>handleFilterChange()} >Apply Filters</button>

          </div>
      
    </div>
  )
}

export default FilterResourceModal
