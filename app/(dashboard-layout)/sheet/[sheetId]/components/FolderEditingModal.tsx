'use client'
import { FullQuestionType } from '@/app/(dashboard-layout)/question/[sheetId]/[questionId]/page'
import SubHeading from '@/components/SubHeading'
import Button from '@/components/buttons/Button'
import { Folder, Question } from '@prisma/client'
import React, { FormEvent, useState } from 'react'
import toast from 'react-hot-toast'
import { MdClose } from 'react-icons/md'
import Select from 'react-select';

const FolderEditingModal = ({ folder, onClose,question }: { folder: Folder & {questions:Question[]}, onClose: () => void ,question:FullQuestionType[]}) => {
    const [title, setTitle] = useState<string>(folder.title || '');
    const [description, setDescription] = useState<string>(folder.description || '');
  const [selectedQuestion, setSelectedQuestions] = useState<{ value: number, label: string }[]>(folder.questions.map((question) => { return { value: question.id, label: question.title } }));
  const [optionsToSelect, setOptionsToSelect] = useState<{ value: number, label: string }[]>(question.map((question) => { return { value: question.id, label: question.title } }));

  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const body = {
      title,
      description,
      questions: selectedQuestion.map((question) => question.value),
      folderId: folder.id
    };
  
    setIsLoading(true);
  
    const res = await fetch('/api/folders/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  
    if (res.status === 200) {
      toast.success('Folder Updated Successfully');
    } else {
      toast.error('Something went wrong');
    }
  
    setIsLoading(false);
  };
  
  
  const handleFolderQuestionChange = (selectedOptions:any) => {
    // Extract values from selected options
    const selectedValues = selectedOptions.map((option:any) => option.value);
  
    // Find removed questions
    const removedQuestions = selectedQuestion.filter(question => !selectedValues.includes(question.value));

    const optionsLeft = optionsToSelect.filter((option) => !selectedValues.includes(option.value))
    setOptionsToSelect(optionsLeft)

    //Add the questions which are removed from selected questions
    removedQuestions.forEach((question) => {
      setOptionsToSelect(prevOptions => [...prevOptions, question])
    })

    // Remove questions from selected questions
    
    //Add the selected questions
    setSelectedQuestions(selectedOptions);


  
    // Update folder questions
   
   
  };
  
  
  
    
  return (
    <div className='fixed  bg-black/40 flex flex-row items-center justify-center z-[99999] inset-0'>
      <form onSubmit={ (e)=>handleSubmit(e)} className='bg-white p-4 rounded xs:w-4/5 lg:w-2/5 relative flex flex-col gap-4 '>
              <button className='absolute -right-5 -top-5 bg-red-600 p-3 rounded-full ' onClick={onClose}><MdClose /></button>
              <SubHeading body='Edit Folder' />
              <label htmlFor="title" className='text-2xl font-bold'>Title</label>
                    <input type="text" name="title" id="title" placeholder='Enter title for Folder...' className='form-input rounded' disabled={isLoading} onChange={(e)=>setTitle(e.target.value)} value={title} />
                    <label htmlFor="description" className='text-2xl font-bold'>Description</label>
              <textarea name="description" id="description" placeholder='Enter description for Folder...' className='form-textarea resize-none' disabled={isLoading} onChange={(e) => setDescription(e.target.value)} value={description} rows={5} cols={5} />
              <label htmlFor="questions" className='text-2xl font-bold'>Select Questions</label>
        <Select isMulti options={optionsToSelect} value={selectedQuestion} onChange={(e)=>handleFolderQuestionChange(e)}  />
        <Button type='submit'>Update Folder</Button>

         

        </form>

    </div>
  )
  }

export default FolderEditingModal
