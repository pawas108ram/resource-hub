'use client'
import React, { useState } from 'react'
import { FullResourceTaskType } from '../../layout'
import { LinkType, linkOptions } from './TaskModal';

import SubHeading from '@/components/SubHeading';
import { TextareaAutosize } from '@mui/material';
import { MdClose, MdDelete } from 'react-icons/md';
import toast from 'react-hot-toast';
import Link from 'next/link';

const EditTaskCardModal = ({ task, onClose }: { task: FullResourceTaskType, onClose: () => void }) => {
    const [title, setTitle] = useState<string>(task.title || '');
    const [description, setDescription] = useState<string>(task.description || '');
    const [expectedDuration, setExpectedDuration] = useState<string>(task.expectedDuration || '');
    const [questionLinks, setQuestionLinks] = useState<{ title: string, link: string }[]>(task.questionLinks.map((link) => ({ title: link.title, link: link.link })) || []);
    console.log(questionLinks);
    const [fileLinks, setFileLinks] = useState<{title:string,link:string}[]>(task.fileLinks.map((link)=>({title:link.title,link:link.link})) || []);
    const [imageLinks, setImageLinks] = useState<{title:string,link:string}[]>(task.imageLinks.map((link)=>({title:link.title,link:link.link})) || []);
    const [videoLinks, setVideoLinks] = useState<{title:string,link:string}[]>(task.videoLinks.map((link)=>({title:link.title,link:link.link})) || [] );
    const [websiteLinks, setWebsiteLinks] = useState<{title:string,link:string}[]>(task.websiteLinks.map((link)=>({title:link.title,link:link.link})) || []);
    const [currentLinkType, setCurrentLinkType] = useState<LinkType>('questionLinks');
    const [linkTitle, setLinkTitle] = useState<string>('');
    const [linkUrl, setLinkUrl] = useState<string>('');

    const handleAddLink = () => {
        if (linkTitle.length === 0 || linkUrl.length === 0) {
            toast.error('Please fill all the fields'); return;
        }
    
        switch (currentLinkType) {
            case 'questionLinks': {
                setQuestionLinks([...questionLinks, { title: linkTitle, link: linkUrl }]);
                break;

            }
            case 'fileLinks': {
                setFileLinks([...fileLinks, { title: linkTitle, link: linkUrl }]);
                break;

            }
            case 'imageLinks': {
                setImageLinks([...imageLinks, { title: linkTitle, link: linkUrl }]);
                break;

            }
            case 'videoLinks': {
                setVideoLinks([...videoLinks, { title: linkTitle, link: linkUrl }]);
                break;

            }
            case 'websiteLinks': {
                setWebsiteLinks([...websiteLinks, { title: linkTitle, link: linkUrl }]);
                break;

            }
            default: {
                break;
            }
                
        }
        setLinkTitle('');
        setLinkUrl('');
        setCurrentLinkType('questionLinks');
    }

    const handleUpdateTask = async () => {
        
            const body = {
                title, description, expectedDuration, questionLinks, fileLinks, imageLinks, videoLinks, websiteLinks,taskId:task.id
            };
            const res = await fetch('/api/tasks/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            if (res.ok) {
                toast.success('Task Updated Successfully');
                onClose();
            }
            else {
                const text = await res.text();
                toast.error(text);
            }
        
    }

    
  return (
    <div className='flex flex-row items-center justify-center bg-black/60 fixed inset-0 z-[99999]'>
    <div className='flex flex-col bg-black rounded p-2 lg:w-3/5 xs:w-full gap-2 relative h-5/6  '>
    <button className='bg-red-500 p-3 rounded-full absolute top-0 right-0 ' onClick={() => onClose()}><MdClose /></button>
        <div className="flex flex-row gap-1 w-full h-full bg-black text-white overflow-hidden">
            <div className="flex flex-col gap-1 w-3/5  rounded p-1 outline-black outline outline-1 h-full ">
            
                <div className="flex flex-col gap-1 h-full overflow-y-auto pb-8">
                    <SubHeading body={`Edit Your Task ${task.title}`} className='underline' />
                    <span>Title for the Task</span>
                    <input type="text" name="title" id="title" className='form-input rounded bg-white/10' placeholder='Enter the title for task' value={title} onChange={(e)=>setTitle(e.target.value)} />
                    <span>Description for the Task</span>
                    <TextareaAutosize name="description" id="description" className='form-input rounded shrink-0 ' placeholder='Enter the description for task' minRows={2} value={description} onChange={(e)=>setDescription(e.target.value)} />
                    <span>Expected Duration for the Task</span>
                    <input type="text" name="expectedDuration" id="expectedDuration" className='form-input rounded ' placeholder='Enter the expected duration for task' value={expectedDuration} onChange={(e)=>setExpectedDuration(e.target.value)} />
            
                </div>
                <div className="flex flex-col gap-1 bg-black rounded p-2 text-white ">
                <div className="flex flex-row gap-3 items-center bg-black text-white rounded p-1">
                        <span className='whitespace-nowrap'>Choose type of link to be added</span>
                        <select className='form-select w-full text-black' onChange={(e) => {
                            setCurrentLinkType(e.target.value as LinkType);
                            console.log(e.target.value);
                        }}>
                            {linkOptions.map((linkOption) => (
                                  <option key={linkOption.value} value={linkOption.value} >{linkOption.label}</option>
                              ))}
            
                        </select>
                    </div>
                    <span>Title for the link</span>
                    <input type="text" name="linkTitle" id="linkTitle" className='form-input rounded text-black ' placeholder='Enter the title for link' value={linkTitle} onChange={(e)=>setLinkTitle(e.target.value)} />
                    <span>Link Url</span>
                    <input type="text" name="linkUrl" id="linkUrl" className='form-input rounded text-black ' placeholder='Enter the link url' onChange={(e) => setLinkUrl(e.target.value)} value={linkUrl} />
                      <button className='bg-white  text-black self-center font-semibold rounded py-2 px-4' onClick={handleAddLink}>Add Link</button>
                </div>
            
            </div>
            <div className='flex flex-col gap-1 p-1 rounded w-2/5 outline outline-black outline-1 h-full overflow-y-auto'>
                <SubHeading body='Task Urls' className='underline' />
                <span>Question Links</span>
                {questionLinks.length !== 0 ? <div className='flex flex-col gap-1 lg:text-sm xs:text-xs p-1 bg-black rounded'>
                    {questionLinks.map((questionLink,ele) => (
                        <div className='flex flex-row items-center gap-2 truncate text-white w-full justify-between p-1 outline outline-white outline-1' key={questionLink.link}>
            
                            <Link href={questionLink.link}>{questionLink.title}</Link>
                            <button className='bg-white text-black p-2 rounded-full ' onClick={()=>setQuestionLinks((prevQuestions)=>prevQuestions.filter((que:any,ind)=>ind!==ele))}><MdDelete/></button>
                        </div>
                    ))}
                </div> : <span className='bg-black/90 lg:text-sm xs:text-xs text-white p-1 rounded'>No Question Links Added</span>}
                <span>File Links</span>
                {fileLinks.length !== 0 ? <div className='flex flex-col gap-0.5 lg:text-sm xs:text-xs p-1 bg-black rounded'>
                    {fileLinks.map((fileLink,ele) => (
                        <div className='flex flex-row items-center gap-2 truncate text-white w-full justify-between p-1 outline outline-white outline-1' key={fileLink.link}>
            
                            <Link href={fileLink.link}>{fileLink.title}</Link>
                            <button className='bg-white text-black p-2 rounded-full ' onClick={()=>setFileLinks((prevQuestions)=>prevQuestions.filter((que:any,ind)=>ind!==ele))}><MdDelete/></button>
                        </div>
                    ))}
                </div> : <span className='bg-black/90 lg:text-sm xs:text-xs text-white p-1 rounded'>No File Links Added</span>}
                <span>Image Links</span>
                {imageLinks.length !== 0 ? <div className='flex flex-col gap-0.5 lg:text-sm xs:text-xs p-1 bg-black rounded'>
                    {imageLinks.map((imageLink,ele) => (
                        <div className='flex flex-row items-center gap-2 truncate text-white w-full justify-between p-1 outline outline-white outline-1' key={imageLink.link}>
            
                            <Link href={imageLink.link}>{imageLink.title}</Link>
                            <button className='bg-white text-black p-2 rounded-full ' onClick={()=>setImageLinks((prevImages)=>prevImages.filter((que:any,ind)=>ind!==ele))}><MdDelete/></button>
                        </div>
                    ))}
                </div> : <span className='bg-black/90 lg:text-sm xs:text-xs text-white p-1 rounded'>No Image Links Added</span>}
                <span>Video Links</span>
                {videoLinks.length !== 0 ? <div className='flex flex-col gap-0.5 lg:text-sm xs:text-xs p-1 bg-black rounded '>
                    {videoLinks.map((videoLink,ele) => (
                        <div className='flex flex-row items-center gap-2 truncate text-white w-full justify-between p-1 outline outline-white outline-1' key={videoLink.link}>
            
                            <Link href={videoLink.link}>{videoLink.title}</Link>
                            <button className='bg-white text-black p-2 rounded-full ' onClick={()=>setVideoLinks((prevVideos)=>prevVideos.filter((que:any,ind)=>ind!==ele))}><MdDelete/></button>
                        </div>
                    ))}
                </div> : <span className='bg-black/90 lg:text-sm xs:text-xs text-white p-1 rounded'>No Video Links Added</span>}
                <span>External Website Links</span>
                {websiteLinks.length !== 0 ? <div className='flex flex-col gap-0.5 lg:text-sm xs:text-xs p-1 bg-black rounded'>
                    {websiteLinks.map((websiteLink,ele) => (
                        <div className='flex flex-row items-center gap-2 truncate text-white w-full justify-between p-1 outline outline-white outline-1' key={websiteLink.link}>
            
                            <Link target='_blank' href={websiteLink.link}>{websiteLink.title}</Link>
                            <button className='bg-white text-black p-2 rounded-full ' onClick={()=>setWebsiteLinks((prevWebsites)=>prevWebsites.filter((que:any,ind)=>ind!==ele))}><MdDelete/></button>
                        </div>
                    ))}
                </div>:<span className='bg-black/90 lg:text-sm xs:text-xs text-white p-1 rounded'>No External Website Links Added</span>}
            
            </div>
        </div>
        <button className='bg-blue-500 py-2 px-4 text-white font-semibold self-center rounded' onClick={()=>handleUpdateTask()}>Edit Task </button>

        
       
      

 
                      
                  

</div>
</div>
  )
}

export default EditTaskCardModal
