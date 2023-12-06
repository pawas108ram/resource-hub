'use client'


import { AiFillPlusSquare } from 'react-icons/ai'
import Button from '../buttons/Button'
import { useState } from 'react'
import AddSheetResourceModal from '../modals/AddSheetResourceModal'
import { MdClose, MdSearch } from 'react-icons/md'


import FilterModal from '../modals/FilterSheetModal'


import clsx from 'clsx'





const ControlBar = ({title,setTitle}:{title:string,setTitle:React.Dispatch<React.SetStateAction<string>>}) => {
  const [addModal, setAddModal] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [searchModal, setSearchModal] = useState(false);
  
  

  
  return (
    <>
      {addModal && <AddSheetResourceModal onClose={() => setAddModal(false)} />}
      
      {filterModal && <FilterModal onClose={() => setFilterModal(false)} />}

      
      <div className="flex flex-col gap-1 w-full ">
        <div className={clsx('lg:p-4 bg-white/10  flex flex-row items-center gap-2  xs:justify-between xs:p-2 rounded xs:w-full   ',searchModal && 'flex flex-col gap-1 ')}>
       <>
       <div className='flex flex-row items-center gap-4 w-full lg:justify-start xs:justify-between'>
          <button className={clsx('p-4 rounded-full bg-black text-white xs:flex lg:hidden  ',searchModal && 'bg-red-500')} onClick={() => setSearchModal((prev)=>!prev)}>{searchModal ? <MdClose /> : <MdSearch size={20} />}</button>
          <div className={clsx('flex flex-col gap-1 xs:w-full lg:flex lg:w-3/5   ', searchModal? 'xs:flex':'xs:hidden')}>
              <span className='text-2xl font-semibold'>Search Sheets</span>
              <input type="text" name="searchSheets" id="searchSheets" className='form-input py-2 rounded bg-white/10 text-blue-600 ' placeholder='Search Sheets By Title' value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              {!searchModal && <div className="flex flex-row gap-4 ">
                <button className='p-4 rounded-full bg-white/60 text-black' onClick={() => setAddModal(true)}><AiFillPlusSquare size={24} /></button>
                <Button onClick={() => setFilterModal(true)}>Filter Sheets</Button>
              </div>}
      </div>
           
          </>

          
          
         
             
        </div>
        
        
      </div>
    </>
  )
}

export default ControlBar
