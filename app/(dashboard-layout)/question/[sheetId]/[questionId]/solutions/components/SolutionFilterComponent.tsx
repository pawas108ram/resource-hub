'use client'
import FilterSolutionModal from '@/components/modals/FilterSolutionModal';
import React, { useState } from 'react'
import { MdFilterListAlt } from 'react-icons/md';

const SolutionFilterComponent = ({questionId,sheetId}:{questionId:string,sheetId:string}) => {
    const [showFilter,setShowFilter]=useState(false);
  return (
      <> 
          {showFilter && <FilterSolutionModal onClose={() => setShowFilter(false)} questionId={questionId} sheetId={sheetId} />}
          <button className='bg-white rounded-full p-3 ' onClick={()=>setShowFilter(true)}>
              <MdFilterListAlt size={20} />
          </button>
      
    </>
  )
}

export default SolutionFilterComponent
