import React from 'react'
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';
import clsx from 'clsx';
interface InputProps{
    label: string;
    type?: string;
    id: string;
    required?: boolean;
    register: UseFormRegister<FieldValues>;
    errors: FieldErrors;
    isLoading?: boolean;

}

const Input: React.FC<InputProps> = ({ label, type = "text", id, register, required, errors, isLoading }) => {
    console.log(errors[id], errors[id]?.message);
  return (
    <div className='flex flex-col w-4/5 gap-2'>
          <label htmlFor={id} className='block  font-medium text-lg leading-6 text-gray-900'>{label}</label>
          <input type={type} id={id} autoComplete={id} disabled={isLoading}  {...register(id, { required })} className={clsx(`
          form-input block rounded-md border-0 px-6 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 text-lg font-medium `,
            errors[id] && 'focus:ring-red-500',
              isLoading && 'opacity-30 cursor-default')} />
          
          
    </div>
  )
}

export default Input
