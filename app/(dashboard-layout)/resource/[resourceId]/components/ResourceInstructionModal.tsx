'use client'
import SubHeading from '@/components/SubHeading';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { BiSolidPlusSquare } from 'react-icons/bi';
import { MdClose } from 'react-icons/md';

const ResourceInstructionModal = ({ onClose, resourceId, instructions }: { onClose: () => void, resourceId: number, instructions: string[] }) => {
    const [instruction, setInstruction] = useState<string>('');
    const [editInstructions, setInstructions] = useState<string[]>(instructions);
    const handleAddGuidelines = async () => {
        const body = {
            instructions: editInstructions,
            resourceId: resourceId
        };
        const res = await fetch(`/api/resources/instructions`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        if (res.ok) {
            toast.success('Guidelines Added Successfully');
            onClose();
        }
        else {
            const text = await res.text();
            toast.error(text);
        }
        
    }
  return (
    <div className='flex flex-row items-center justify-center bg-black/60 fixed inset-0 z-[99999]'>
   
          <div className='flex flex-col bg-white rounded p-2 lg:w-3/5 xs:w-5/6 gap-3 relative h-4/5 overflow-y-auto'>
            <button className='absolute right-2 top-2 bg-red-500 p-3 rounded-full ' onClick={onClose}><MdClose /></button>
              <SubHeading body='Add Guidelines for Resource' className='underline' />
          <div className='flex flex-row items-center gap-2 w-full'>
<input type="text" name="instructions" id="instructions" placeholder='Enter the guidelines here...' className='form-input rounded w-full ' value={instruction} onChange={(e) => setInstruction(e.target.value)} />
<button className='p-3 bg-blue-500 rounded ' onClick={() => {
    if(instruction.length===0) return;
      setInstructions([...editInstructions, instruction]);
      setInstruction('');
}}><BiSolidPlusSquare /></button>

</div>
{editInstructions.length!==0?<ul className='flex flex-col gap-0.5 h-full overflow-y-auto  '>
    {editInstructions.map((instruction, ele) => (
        <div key={ele} className='flex flex-row items-center gap-2'>
            <li className='bg-black/90 text-white rounded p-2 w-full'>{instruction}</li>

              <button className='bg-red-500 p-2 rounded-full' onClick={() => {
                  setInstructions(editInstructions.filter((_, index) => index !== ele))
              }}><MdClose/></button>
        </div>
      ))}
              </ul> : <span className='bg-black/90 text-white rounded p-2 w-full h-full text-2xl font-semibold flex flex-row items-center justify-center'>No Instructions Added</span>}
              <button className='bg-blue-500 text-white font-semibold rounded py-2 px-4 ' onClick={()=>handleAddGuidelines()}>Edit/Add Guidelines to Resource</button>
   



    </div>
</div>
  )
}

export default ResourceInstructionModal

