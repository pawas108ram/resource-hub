'use client'
import { User } from '@prisma/client';
import React, { useState } from 'react'
import SubHeading from '../SubHeading';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Input from '../Inputs/Input';
import TextArea from '../Inputs/TextArea';
import Image from 'next/image';
import {CldUploadButton} from 'next-cloudinary'
import Button from '../buttons/Button';
import { MdClose, MdDelete } from 'react-icons/md';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Check } from 'lucide-react';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

interface EditUserModalProps {
    onClose: () => void;
    currentUser: User;
}
    
const ConfirmUserModal: React.FC<EditUserModalProps> = ({ onClose, currentUser }) => {
  const [title, setTitle] = useState('');
  const [deleteacceppted, setDelete] = useState(false);
  const router = useRouter();
  
  const handleChange = (e: any) => {
    setTitle(e.target.value);
    if(e.target.value===currentUser.profileLink){
      setDelete(true);
    }
    else {
      setDelete(false);
    }
  }

  const handleDelete =async () => {
    const res = await fetch('/api/user/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: currentUser.id
      })
    });
    if (res.status === 200) {
      toast.success('User Deleted');
      signOut();
      
     
    } else {
      toast.error('Something went wrong');
    }
   
  }
  
  return (
    <div className='fixed inset-0 bg-black/40 z-[999999] flex flex-row items-center justify-center'>
      <div className='flex flex-col p-2 bg-black rounded lg:w-2/5 xs:w-5/6 gap-2 relative'>
        <button className='absolute -right-5 -top-5 bg-red-600 p-3 rounded-full' onClick={onClose}><MdClose /></button>
        <SubHeading body='Confirm Delete' className='text-white border-b-4 border-white w-full' />
        <span>To Confirm delete enter  {currentUser.profileLink} below</span>
        <input type="text" className='bg-white/10 text-white form-input' placeholder='Ente the code above' onChange={(e)=>handleChange(e)} name="" id="" />
        <div className='flex flex-row items-center gap-4 justify-center'>
          <button className='bg-red-500 py-1 px-4 rounded' onClick={onClose}>Cancel Delete</button>
          <button className={clsx(' py-1 px-4 rounded pointer-events-none',deleteacceppted===true? 'pointer-events-auto bg-green-600':'pointer-events-none bg-green-300')} onClick={()=>handleDelete()}>Confirm Delete</button>
        </div>
        

      </div>
    </div>
  )
}
  

const EditUserModal: React.FC<EditUserModalProps> = ({ onClose, currentUser }) => {
    const { register,handleSubmit,setValue,formState:{errors},watch} = useForm<FieldValues>({
        defaultValues: {
            name: currentUser.name,
            bio: currentUser.bio,
            image: currentUser.image,
        }
    });
  const [confirmDelete, setConfirmDelete] = useState(false);
    const image=watch('image');
    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);
        axios.put('/api/user/update', data).then(() => toast.success('User Updated')).catch(() => toast.error('Error Updating User')).finally(() => setIsLoading(false));

    }
    const handleUpload = (result: any) => {
        setValue('image', result.info.secure_url, { 
          shouldValidate: true 
        });
    }
    const [isLoading, setIsLoading] = React.useState(false);
    
  return (
      
    <div className='fixed inset-0 z-[99999] bg-black/60  flex flex-row items-center justify-center '>
      
      <div className='xs:w-4/5 lg:w-2/5 p-4  bg-black text-white  rounded flex flex-col gap-4 relative  '>
      {confirmDelete && <ConfirmUserModal onClose={ ()=>setConfirmDelete(false)} currentUser={currentUser} />}
              <button className='absolute -right-5 -top-5 bg-red-600 p-3 rounded-full' onClick={onClose}><MdClose/></button>
                  <SubHeading body='Edit User' className='text-white border-b-4 border-white w-full' />
        <button className='flex flex-row items-center gap-2 bg-red-600 text-white self-start py-2 px-4 rounded' onClick={()=>setConfirmDelete(true)}>
          <span>Delete Account</span>
          <MdDelete/>

                  </button>
                  <form onSubmit={handleSubmit(onSubmit)} className='p-4 flex flex-col gap-4'>
                      <Input type='text' label='Name' register={register} id='name' errors={errors} className='w-full' isLoading={isLoading} />
                      <TextArea placeholder='Enter your bio' label='Bio' register={register} id='bio' className='w-full' />
                      <div>
                    <label
                      htmlFor="photo"
                      className="
                        block
                        text-sm
                        font-medium
                        leading-6
                        text-white
                      "
                    >
                      Photo
                    </label>
                    <div className="mt-2 flex items-center gap-x-3 text-white">
                      <Image
                              width={50}
                              height={50}
                        className="rounded-full object-contain h-11 w-11 bg-white p-1"
                        src={image || currentUser?.image || '/images/user.png'}
                alt="Avatar"
                
                              />
                              <CldUploadButton onUpload={handleUpload} options={{maxFiles:1}} uploadPreset='f12lx4bt' ><Button secondary type='button'  disabled={isLoading} >Change Image</Button></CldUploadButton>
                          </div>
          
                      </div>
                      <Button type='submit' disabled={isLoading}  >Save Changes</Button>
          
          
          
          
                  </form>
          
              </div>
      
      
    </div>
  )
}

export default EditUserModal
