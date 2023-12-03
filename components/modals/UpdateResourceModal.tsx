'use client'
import { Resource } from '@prisma/client'
import React, { useState } from 'react'
import { MdClose } from 'react-icons/md'
import SubHeading from '../SubHeading'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import Input from '../Inputs/Input'
import TextArea from '../Inputs/TextArea'
import CheckBox from '../Inputs/CheckBox'
import Button from '../buttons/Button'
import toast from 'react-hot-toast'

const UpdateSheetModal = ({ resource, onClose }: { resource: Resource, onClose: () => void }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { register,handleSubmit,formState:{errors}} = useForm<FieldValues>({
    defaultValues: {
      title: resource.title,
      description: resource.description,
      isPublic: resource.isPublic,
    }
  })
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true)
    await fetch('/api/resources/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: data.title,
        description: data.description,
        isPublic: data.isPublic,
        sheetId: resource.id
      })
    }).then(() => toast.success('Resource Updated')).catch((err) => toast.error(err.response.data)).finally(() => {
      setIsLoading(false);
      onClose();
  })
  }

  return (
      <div className='fixed inset-0 pointer-events-all bg-black/60 z-[9999] flex flex-row items-center justify-center'>
      <div className='bg-white p-4 rounded xs:w-4/5 lg:w-2/5 relative flex flex-col gap-8 '>
        <button className='absolute -right-5 -top-5 bg-red-600 p-3 rounded-full ' onClick={onClose}><MdClose /></button>
        <SubHeading body='Update Resource' className='text-center text-gray-800' />
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 bg-gray-300 p-4 rounded'>
          <Input register={register} label='Title' id='title' type='text' className='w-full' errors={errors} required />
          <TextArea register={register} label='Decription' id='description' className='w-full' cols={5} rows={5} />
          <CheckBox register={register} id='isPublic' isLoading={isLoading} />
          <Button type='submit' disabled={isLoading}  >Update</Button>
        </form>
              
          </div>
      
    </div>
  )
}

export default UpdateSheetModal
