'use client'
import { User } from '@prisma/client';
import React from 'react'
import SubHeading from '../SubHeading';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Input from '../Inputs/Input';
import TextArea from '../Inputs/TextArea';
import Image from 'next/image';
import {CldUploadButton} from 'next-cloudinary'
import Button from '../buttons/Button';
import { MdClose } from 'react-icons/md';
import toast from 'react-hot-toast';
import axios from 'axios';

interface EditUserModalProps {
    onClose: () => void;
    currentUser: User;
    }

const EditUserModal: React.FC<EditUserModalProps> = ({ onClose, currentUser }) => {
    const { register,handleSubmit,setValue,formState:{errors},watch} = useForm<FieldValues>({
        defaultValues: {
            name: currentUser.name,
            bio: currentUser.bio,
            image: currentUser.image,
        }
    });
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
              <div className='xs:w-4/5 lg:w-2/5 p-4  bg-white   rounded flex flex-col gap-4 relative  '>
              <button className='absolute -right-5 -top-5 bg-red-600 p-3 rounded-full' onClick={onClose}><MdClose/></button>
                  <SubHeading body='Edit User' className='text-gray-700 border-b-4 border-gray-800 w-full' />
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
                        text-gray-900
                      "
                    >
                      Photo
                    </label>
                    <div className="mt-2 flex items-center gap-x-3">
                      <Image
                              width={50}
                              height={50}
                        className="rounded-full object-contain h-11 w-11"
                        src={image || currentUser?.image || '/images/placeholder.jpg'}
                        alt="Avatar"
                              />
                              <CldUploadButton onUpload={handleUpload} options={{maxFiles:1}} uploadPreset='f12lx4bt'><Button secondary type='button' disabled={isLoading} >Change Image</Button></CldUploadButton>
                          </div>
          
                      </div>
                      <Button type='submit' disabled={isLoading}  >Save Changes</Button>
          
          
          
          
                  </form>
          
              </div>
      
      
    </div>
  )
}

export default EditUserModal
