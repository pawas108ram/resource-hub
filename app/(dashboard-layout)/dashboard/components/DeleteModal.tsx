'use client'
import Loader from '@/components/Loader';
import { Resource, Sheet } from '@prisma/client';
import axios from 'axios';
import React from 'react'
import toast from 'react-hot-toast';
import { AiFillDelete } from 'react-icons/ai';
import { MdCancel } from 'react-icons/md';
import { set } from 'zod';
interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    isSheet: boolean;
    sheetId: number;
    
   
}


const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, isSheet, sheetId }) => {
    const [loading, setLoading] = React.useState<boolean>(false);
    const handleClose = (e:React.MouseEvent<HTMLDivElement>) => {
        if (e.currentTarget.id === 'wrapper') {
            onClose();
        }
    }
    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
        setLoading(true);
        axios.delete(`/api/${isSheet ? 'sheets' : 'resources'}/${sheetId}`).then(() => toast.success(`${isSheet ? 'Sheet' : 'Resource'} Deleted`)).catch((err) => toast.error(err.response.data)).finally(() => setLoading(false));
        
       
        onClose();
        
        
    }
    
  return (
      <div className='bg-black/20 fixed inset-0 backdrop-blur-sm flex justify-center items-center ' id='wrapper' onClick={handleClose}>
          {loading && <Loader/>}
          {!loading && <div className='bg-white flex flex-col p-4 rounded-md shadow-sm max-w-md w-full items-center relative'>
              <button className='absolute -top-5 -right-5 p-3 rounded-full bg-red-500 ' onClick={onClose}><MdCancel size={20} /></button>
              <span className='text-lg font-semibold '>Do you want to delete the {isSheet ? 'Sheet' : 'Resource'} with id {sheetId}??</span>
              <div className='flex flex-row items-center gap-4 justify-center'>
                  <button className='p-2 bg-red-500 text-white rounded' onClick={onClose}><MdCancel size={20} /></button>
                  <button className='p-2 bg-black text-white rounded' onClick={(e) => {
                      handleDelete(e);
                      
                  }

                  }><AiFillDelete size={20} /></button>
              </div>
          </div>
          }
    </div>
  )
}

export default DeleteModal
