'use client'
import { solutionTypes } from '@/app/libs/const/solutionType'

import SubHeading from '@/components/SubHeading'
import { Solution } from '@prisma/client'
import React, { use, useEffect, useState } from 'react'

import SolutionBody from './Solution'






const SolutionComponent =  ({ solutions }: {  solutions:Solution[] }) => {
  



 


  
  return (
      <div className='flex flex-col gap-3 bg-black/90 p-3 rounded'> 
      <SubHeading body='My Solutions' />
      {solutions && solutionTypes.map((type) => (
        <SolutionBody key={type.value} type={type.value} solution={solutions}  />
      ))}
      
      
          
      
    </div>
  )
}

export default SolutionComponent
