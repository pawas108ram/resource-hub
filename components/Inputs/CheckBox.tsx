import React from 'react'
import { FieldValues, UseFormRegister } from 'react-hook-form'

const CheckBox = ({isLoading,register,id}:{isLoading:boolean,register:UseFormRegister<FieldValues>,id:string}) => {
    return (
    
        <div className='flex flex-row items-center text-lg gap-4  '>
            <input type="checkbox"  id={id} className='h-6 w-6 rounded form-checkbox  ring-0 focus:ring-inset  focus:ring-1 focus:ring-blue-200 ' disabled={isLoading} {...register(id)} />
            <label htmlFor="isPublic">Public</label>
    </div>
  )
}

export default CheckBox
