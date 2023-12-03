'use client'
import React from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import Input from '../Inputs/Input'
import Button from '../buttons/Button'
import { MdSearch } from 'react-icons/md'

import { useRouter } from 'next/navigation'

const SearchForm = ({onClose}:{onClose?:()=>void}) => {
    const router = useRouter();

    const { register,handleSubmit,formState:{errors},reset,watch} = useForm<FieldValues>({
        defaultValues: {
            title:'',
        }
    }) 
    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        const encodedSearchTtitle = encodeURI(data.title);
        router.push(`/sheet/search?title=${encodedSearchTtitle}`);
        if (onClose) {
            onClose();
        }
    }
    


  return (
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col   py-2 px-6 w-full'>
          <div className=" flex flex-row items-end gap-4 ">
              <Input register={register} label='Search by Sheet Title' errors={errors} id="title" className='w-full xs:w-5/6 ' />
              <Button type='submit'   ><MdSearch size={20} /></Button>
          </div>
       
          
      </form>
  )
}

export default SearchForm
