'use client'
import React, { useState } from 'react'
import { FullSheetCommentType } from './CommentModal'
import Content from '../Content'

import { DeleteComment } from '@/app/_actions/DeleteComment'
import SubHeading from '../SubHeading'

import TextArea from '../Inputs/TextArea'

import Button from '../buttons/Button'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'

import { MdClose } from 'react-icons/md'
import { UpdateComment } from '@/app/_actions/UpdateComment'
import toast from 'react-hot-toast'

const UpdateModal = ({comment,onClose}:{comment:FullSheetCommentType,onClose:()=>void}) => {
    const { register, formState: { errors }, handleSubmit } = useForm<FieldValues>({
        defaultValues: {
            body:comment.body,
        }
    });
    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        setIsLoading(true)
        await UpdateComment(comment.id, data.body).then(() => toast.success('Comment Updated')).catch((err) => toast.error(err.response.data)).finally(() => {
            setIsLoading(false);
            onClose();
        });
    }
    const [isLoading, setIsLoading] = useState(false)
    return (
        <div className='fixed inset-0 z-[9999] flex flex-row items-center bg-black/60 justify-center '>
            <div className='bg-black text-white  p-4 rounded xs:w-4/5 lg:w-2/5 relative flex flex-col gap-8 '>
        <button className='absolute -right-5 -top-5 bg-red-600 p-3 rounded-full ' onClick={onClose}><MdClose /></button>
        <SubHeading body='Update Comment' className='text-center ' />
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 bg-white/10 p-4 rounded'>
         
          <TextArea placeholder='Enter Comment Body' register={register} label='Comment Body' id='body' className='w-full text-white' cols={5} rows={4}  />
          
          <Button type='submit' disabled={isLoading}  >Update</Button>
        </form>
              
          </div>
        </div>
    )
}

const CommentUpdateModal = ({ comment, onClose }: { comment: FullSheetCommentType, onClose: () => void }) => {
    const [showModal, setShowModal] = useState(false);
  return (
      <>
          {showModal && <UpdateModal comment={comment} onClose={()=>setShowModal(false)}/>}
          <div className='absolute top-0 right-10 p-4 bg-black rounded w-40 h-40 z-20 flex flex-col text-white gap-3'>
              <Content body='Edit Settings' className='text-white text-lg font-bold border-b-2 border-white w-full text-center ' />
              <button className='bg-gray-100 w-full text-black rounded shadow font-semibold py-1 px-4' onClick={()=>setShowModal(true)}>Edit</button>
                <button className='bg-red-500 w-full text-black rounded shadow font-semibold py-1 px-4' onClick={()=>DeleteComment(comment.id)}>Delete</button>
          
          
              </div>
      </>
  )
}

export default CommentUpdateModal
