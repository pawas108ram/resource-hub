'use client'
import Button from '@/components/buttons/Button'
import AddSheetResourceModal from '@/components/modals/AddSheetResourceModal'
import FilterResourceModal from '@/components/modals/FilterResourceModal'
import { ResourceTag } from '@prisma/client'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { AiFillPlusSquare } from 'react-icons/ai'
import { MdClose, MdSearch } from 'react-icons/md'



const ResourceControlBar = ({ title, setTitle, resourceFilterTags, setResourceFilterTags }: { title: string, setTitle: React.Dispatch<React.SetStateAction<string>>, resourceFilterTags: { value: ResourceTag, label: string }[], setResourceFilterTags: React.Dispatch<React.SetStateAction<{ value: ResourceTag, label: string }[]>> }) => {
  const [searchModal, setSearchModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  
  useEffect(() => {
    
  })
  return (
    <>
      {addModal && <AddSheetResourceModal onClose={() => setAddModal(false)} />}
      {filterModal && <FilterResourceModal onClose={() => setFilterModal(false)} resourceFilterTags={resourceFilterTags} setResourceFilterTags={setResourceFilterTags} />}
      <div className='p-4 rounded bg-white/10 w-full flex flex-row items-center justify-between gap-4'>
        <button className={clsx('p-4 bg-black text-white rounded-full xs:flex lg:hidden',searchModal && 'bg-red-500')} onClick={()=>setSearchModal((prev)=>!prev)}>{searchModal ? <MdClose /> : <MdSearch />}</button>
        <div className={clsx('flex flex-col items-center gap-2 w-4/5  lg:flex',searchModal ?'xs:flex':'xs:hidden')}>
                  <span className='text-md font-semibold text-2xl w-full self-start xs:hidden lg:flex'>Search Resource</span>
                <input type="text" name="searchresource" id="searchresource" className='form-input w-full rounded bg-black text-blue-600' placeholder='Search Resource By Title' value={title} onChange={(e)=>setTitle(e.target.value)}/>
            </div>
        {!searchModal && <div className='flex flex-row items-center gap-4'>
          <button className='p-4 bg-blue-500 rounded-full ' onClick={()=>setAddModal(true)}><AiFillPlusSquare size={20} /></button>
          <Button type='button' onClick={()=>setFilterModal(true)}>Filter Resources</Button>
      
        </div>}
      
      
      </div>
    </>
  )
}


export default ResourceControlBar;

