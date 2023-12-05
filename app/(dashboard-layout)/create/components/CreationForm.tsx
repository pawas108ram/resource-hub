'use client'


import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import clsx from 'clsx';
import Input from "@/components/Inputs/Input";

import Button from "@/components/buttons/Button";
import TextArea from "@/components/Inputs/TextArea";
import axios from "axios";
import toast from "react-hot-toast";
import { ResourceTag } from "@prisma/client";
import Select from 'react-select';
import { resourceTypeOptions } from "@/app/libs/const/resourceTypeOptions";
import { Unstable_NumberInput as NumberInput } from '@mui/base/Unstable_NumberInput';


type CreationType = 'SHEET' | 'RESOURCE';

const CreationForm = ({onClose}:{onClose:()=>void}) => {
    const [variant, setVariant] = useState<CreationType>('SHEET');
  const [loading, setLoading] = useState<boolean>(false);
  const [tags, setTags] = useState<{ value: ResourceTag, label: string }[]>([]);
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [keys, setKeys] = useState<number>(0);
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FieldValues>({
        defaultValues: {
        title: '',
        description: '',
       
        
        }
    });
  const handleChange = (e: any) => {
    if (  parseInt(e.target.value)>=0 && parseInt(e.target.value)<=10) {
      setKeys(parseInt(e.target.value));
    }
    else {
      setKeys(0);
    }

  }
   
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setLoading(true);
    if (variant === 'RESOURCE') {
      
      axios.post('/api/resources', { ...data, tags: tags.map((tag) => tag.value), isPublic, keys }).then(() => toast.success('Resource Created')).catch((err) => toast.error(err.response.data)).finally(() => {
        setLoading(false);
        onClose();
      })
    }
    else{
      axios.post('/api/sheets', { ...data, isPublic, keys }).then(() => toast.success('Sheet Created')).catch((err) => toast.error(err.response.data)).finally(() => {
        setLoading(false);
        onClose();
      })
    }
    reset();
    setTags([]);
    setKeys(0);
  }

  return (
    <div className="flex flex-col gap-2 items-center justify-center    bg-white/10 p-4 rounded xs:h-full lg:h-auto  ">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-black text-white p-4 rounded flex flex-col  w-full items-center gap-4 xs:h-full lg:h-auto " >
        <div className="flex flex-col gap-4 xs:h-full lg:h-auto overflow-y-auto items-center w-full">
          <div className="flex flex-row items-center gap-2 lg:text-2xl font-semibold xs:text-lg xs:whitespace-nowrap">
            <button onClick={()=>setVariant('SHEET')} >Create a <span className={clsx(variant==='SHEET'?'text-white':'text-white/30')}>Sheet</span></button>
            <span>/</span>
            <button onClick={() => setVariant('RESOURCE')} className={clsx(variant === 'SHEET' ? 'text-white/30' : 'text-white')}>Resource</button>
          
          </div>
          <Input type="text" isLoading={loading} register={register} label={`${variant==='RESOURCE'?'Resource':'Sheet'} Title`} placeholder={`Title for the ${variant}`} errors={errors} id="title" className="w-5/6"  />
          <TextArea label="Description" id="description" placeholder={`Description of the ${variant}`} register={register}  className="w-5/6 "/>
          {variant === 'RESOURCE' && <span className="lg:text-xl xs:text-sm font-medium">Choose type of Resource</span>}
          {variant === 'RESOURCE' && <Select options={resourceTypeOptions} value={tags} onChange={(e: any) => setTags(e)}  isMulti isClearable  className="w-5/6  text-blue-500" maxMenuHeight={150}  />}
          {!isPublic && <div className="flex flex-col w-5/6 gap-1">
            <span className="lg:text-lg xs:text-base" >Enter number of keys for Resource Access(0 to 10)</span>
            <input type="number" name="keys" id="keys" min={0} max={10} value={keys} onInput={handleChange} style={{backgroundColor:'black'}} className="form-input bg-white/10 lg:text-base xs:text-sm text-blue-500" placeholder="Enter number of keys from 1 to 10" />
          </div>}
          <div className="self-start pl-12 flex flex-row items-center gap-3"><input type="checkbox" className='form-checkbox' name="" id="" checked={isPublic} onChange={() => {
            setIsPublic((prev) => !prev);
          setKeys(0)}} /><span>Public</span></div>
        </div>
        <Button type="submit" disabled={loading} >Create</Button>
       

        
      </form>
     
      
    </div>
  )
}

export default CreationForm
