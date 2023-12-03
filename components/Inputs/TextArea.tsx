import React from 'react'
import { FieldValues, UseFormRegister } from 'react-hook-form'
import clsx from 'clsx';

const TextArea = ({ label ,id,rows=3,cols=5,register,className,disabled,placeholder}:{label:string,id:string,cols?:number,rows?:number,register:UseFormRegister<FieldValues>,className?:string,disabled?:boolean,placeholder:string}) => {
  return (
    <div className={clsx(`flex flex-col gap-2 w-4/5`,className)}>
          <span className='font-medium lg:text-lg xs:text-base  text-white '>{label}</span>
          <textarea className='form-textarea w-full resize-none lg:text-base xs:text-sm bg-white/10 text-blue-500' placeholder={placeholder} {...register(id,{required:true})}  name={id} id={id} cols={cols} rows={rows}></textarea>
      
    </div>
  )
}

export default TextArea
