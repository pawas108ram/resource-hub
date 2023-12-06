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
  className?: string;
  placeholder?: string;

}

const Input: React.FC<InputProps> = ({ label, type = "text", id, register, required, errors, isLoading ,className,placeholder }) => {
    
  return (
    <div className={clsx('flex flex-col w-4/5 gap-2',className)}>
          <label htmlFor={id} className='block  font-medium lg:text-xl xs:text-base leading-6 text-white '>{label}</label>
          <input type={type} id={id} autoComplete={id} disabled={isLoading} placeholder={placeholder}   {...register(id, { required })} className={clsx(`
          form-input block rounded-md border-0 px-6 py-2   shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset bg-white/10 text-white focus:ring-sky-600 lg:text-lg xs:text-sm font-medium `,
            errors[id] && 'focus:ring-red-500',
              isLoading && 'opacity-30 cursor-default')} />
          
          
    </div>
  )
}

export default Input
