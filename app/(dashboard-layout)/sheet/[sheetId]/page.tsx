"use client";
import Heading from "@/components/Heading";
import Loader from "@/components/Loader";
import SubHeading from "@/components/SubHeading";
import { Difficulty, Folder, PublishStatus, QuestionStatus, QuestionTag, Sheet, SheetUser, User } from "@prisma/client";

import React, {  useEffect, useMemo, useState } from "react";
import { dateString } from '../../../libs/utility functions/dateString';
import { MdComment, MdEdit, MdLock, MdPublic, MdSearch } from "react-icons/md";

import QuestionCreation from "./components/QuestionCreation";
import QuestionCard from "./components/QuestionCard";
import FolderCreation from "./components/FolderCreation";
import FolderCard from "./components/FolderCard";


import { useSession } from "next-auth/react";

import Image from "next/image";
import { FullQuestionType } from "../../question/[sheetId]/[questionId]/page";
import {  useRouter, useSearchParams} from "next/navigation";

import UpdateSheetModal from "@/components/modals/UpdateSheetModal";
import { Tooltip } from "@mui/material";
import CommentModal, { FullSheetCommentType } from "@/components/modals/CommentModal";

import { FaFilter } from "react-icons/fa";
import SheetQuestionFilter from "./components/SheetQuestionFilter";
import CircularProgresswithLabel from '@mui/material/CircularProgress';
import PublishStatusModal from "@/components/modals/PublishStatusModal";
import { pusherClient } from "@/app/libs/pusher";
import { FullSheetType } from "../../resource/layout";
import ProgressModal from "./components/ProgressModal";



export type SingleSheetPage = (Sheet & {
  author: User;
  questions: FullQuestionType[];
  users: (SheetUser & {
    user:User
  })[];
  folders: (Folder & {
    questions: FullQuestionType[],
  })[];
});


const SingleSheetPage = ({ params }: { params: { sheetId: string } }) => {
  const sheetId = params.sheetId;
  
  const [sheet, setSheet] = useState<SingleSheetPage | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthor, setIsAuthor] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorLoading, setErrorLoading] = useState(false);
  const [editSheet, setEditSheet] = useState(false);
  const [comments, setComments] = useState<FullSheetCommentType[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [searchTitle, setSearchTitle] = useState('');
  const [filterQuestions, setFilterQuestions] = useState<FullQuestionType[]>([]);
  const [filterModal, setFilterModal] = useState(false);
  const [difficulty, setDifficulty] = useState<{ value: Difficulty, label: string } | null>(null);
  const [unattemptedQuestions, setUnattemptedQuestions] = useState<number>(0);
  const [solvedQuestions, setSolvedQuestions] = useState<number>(0);
  const [skippedQuestions, setSkippedQuestions] = useState<number>(0);
  const [revisedQuestions, setRevisedQuestions] = useState<number>(0);
  const [tags, setTags] = useState<{ value: QuestionTag, label: string }[] | null>(null);
  const [questionTypeFilter, setQuestionTypeFilter] = useState<QuestionStatus | 'All'>('All');
  const [sheetStatusModal, setSheetStatusModal] = useState(false);
  const [folders, setFolders] = useState<(Folder & { questions: FullQuestionType[] })[]>([]);
  const [publishStatus, setPublishStatus] = useState<PublishStatus>('UNPUBLISHED')
  const [folderQuestionslength, setFolderQuestionsLength] = useState<number>(0);
  const [progressModal, setProgressModal] = useState(false);
  
  
 
  useEffect(() => {
    pusherClient.subscribe('sheet');
    if (sheet) {
      pusherClient.bind('sheet:status', (data: number) => {
        if (sheet.id === data) {
          setPublishStatus((prev) => prev === 'UNPUBLISHED' ? 'PUBLISHED' : 'UNPUBLISHED');
        }
      })
      return () => {
        pusherClient.unsubscribe('sheet');
        pusherClient.unbind('sheet:status');
      }
    }
  }, [sheet])
  

  useEffect(() => {
    if (filterQuestions) {
      setUnattemptedQuestions(filterQuestions.filter((question) => (question?.questionStatus[0]?.status || 'UNATTEMPTED') === QuestionStatus.UNATTEMPTED).length);
      setSolvedQuestions(filterQuestions.filter((question) => (question?.questionStatus[0]?.status || 'UNATTEMPTED') === QuestionStatus.SOLVED).length);
      setSkippedQuestions(filterQuestions.filter((question) => (question?.questionStatus[0]?.status || 'UNATTEMPTED') === QuestionStatus.SKIPPED).length);
      setRevisedQuestions(filterQuestions.filter((question) => (question?.questionStatus[0]?.status || 'UNATTEMPTED') === QuestionStatus.REVISED).length);
    }
    if (folders) {
      folders.forEach((folder) => {
        folder.questions.forEach((question) => {
          setFolderQuestionsLength((prev) => prev + 1);
      
          switch (question?.questionStatus[0]?.status || 'UNATTEMPTED') {
            case QuestionStatus.UNATTEMPTED:
              setUnattemptedQuestions((prev) => prev + 1);
              break;
            case QuestionStatus.SOLVED:
              setSolvedQuestions((prev) => prev + 1);
              break;
            case QuestionStatus.SKIPPED:
              setSkippedQuestions((prev) => prev + 1);
              break;
            case QuestionStatus.REVISED:
              setRevisedQuestions((prev) => prev + 1);
              break;
          }
        
        })
      })
    }
    
    pusherClient.subscribe('folder');
    pusherClient.bind('create:folderquestion', (data: number) => {
      if (parseInt(sheetId) === data) {
        setFolderQuestionsLength((prev) => prev + 1);
        setUnattemptedQuestions((prev) => prev + 1);
      }
     
    });

   

    

    if (folderQuestionslength !== 0 && filterQuestions.length !== 0) {
      setUnattemptedQuestions((prev) => (prev / (folderQuestionslength +filterQuestions.length))* 100);
      setSolvedQuestions((prev) => (prev / (folderQuestionslength + filterQuestions.length)) * 100);
      setSkippedQuestions((prev) => (prev / (folderQuestionslength + filterQuestions.length)) * 100);
      setRevisedQuestions((prev) => (prev / (folderQuestionslength + filterQuestions.length)) * 100);
    }
    if (filterQuestions.length === 0 && folderQuestionslength !== 0) {
      setUnattemptedQuestions((prev) => prev / folderQuestionslength * 100);
      setSolvedQuestions((prev) => prev / folderQuestionslength * 100);
      setSkippedQuestions((prev) => prev / folderQuestionslength * 100);
      setRevisedQuestions((prev) => prev / folderQuestionslength * 100);
    }
    if (filterQuestions.length !== 0 && folderQuestionslength === 0) {    
      setUnattemptedQuestions((prev) => (prev / filterQuestions.length * 100));
      setSolvedQuestions((prev) => prev / filterQuestions.length * 100);
      setSkippedQuestions((prev) => prev / filterQuestions.length * 100);
      setRevisedQuestions((prev) => prev / filterQuestions.length * 100);
    }
    if(filterQuestions.length === 0 && folderQuestionslength === 0){
      setUnattemptedQuestions(0);
      setSolvedQuestions(0);
      setSkippedQuestions(0);
      setRevisedQuestions(0);
    }
    setUnattemptedQuestions((prev) => Math.round(prev));
    setSolvedQuestions((prev) => Math.round(prev));
    setSkippedQuestions((prev) => Math.round(prev));
    setRevisedQuestions((prev) => Math.round(prev));

    return () => {
      setUnattemptedQuestions(0);
      setSolvedQuestions(0);
      setSkippedQuestions(0);
      setRevisedQuestions(0);
      setFolderQuestionsLength(0);
      pusherClient.unsubscribe('folder');
      pusherClient.unbind('create:folderquestion');
    }


    
   
  }, [filterQuestions, folders, folderQuestionslength,folders.length,sheetId]);
  
  
  

  


  
 

  const session = useSession();
  const email = useMemo(() => {
    return session.data?.user?.email;
  }, [session]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams?.toString();
  
 
  useEffect(() => {
    const fetchUser = async () => {
      const user = await fetch(`/api/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email
        })
      }).then((res) => res.json()).catch((err) => console.log(err));
      setCurrentUser(user);
    
      
    }
    fetchUser();
  }, [email])
  useEffect(() => {
    pusherClient.subscribe('folder');
    pusherClient.bind('create:folder', (data: SingleSheetPage) => {
      setSheet(data);
      setFolders(data.folders);
    })
    pusherClient.bind('delete:question', (data: number) => {
      setFilterQuestions((prev) => prev.filter((question) => question.id !== data));
      


      
     
     

    })
    pusherClient.bind('delete:folder', (data: number) => {
      setFolders((prev) => prev.filter((folder) => folder.id !== data));
    })
    pusherClient.bind('update:folder', (data: SingleSheetPage) => {
      setSheet(data);
      setFolders(data.folders);
    })
    return () => {
      pusherClient.unsubscribe('folder');
      pusherClient.unbind('create:folder');
      pusherClient.unbind('delete:question');
      pusherClient.unbind('delete:folder');
      pusherClient.unbind('update:folder');
    }



    

      
      },[sheet])
    
  

  
  

  
  

  
  
  useEffect(() => {
    const fetchSheet = async () => {
      const sheet = await fetch(`/api/sheets/${sheetId}?${searchParamsString}`, {
        
      }).then((res) => {
        if (res.status === 200) {
          return res.json();
        }
        if (res.status === 401) {
         setErrorModal(true);
          
          
        }
      });
      if (sheet !== undefined) {
       
        setSheet(sheet);
        setFolders(sheet.folders);
        
        console.log(sheet);
        if (currentUser && sheet.authorId === currentUser?.id) {
          setIsAuthor(true);
        }
      
      
        
      
        
         
        
    
        
      }
      
      
    }
    
    
    fetchSheet();
    return () => {
      setSheet(null);
      
      
    }
  }, [sheetId,currentUser,router,searchParamsString]);
  useEffect(() => {
    const fetchComments = async () => {
      const comments = await fetch(`/api/sheets/comments/${sheetId}`).then((res) => res.json());
      setComments(comments);
    }
    fetchComments();
    
  }, [sheetId])
  
  const handleStatusChange = () => {
    setSheetStatusModal(true);

    
  }
  
  
  useEffect(() => {
    pusherClient.subscribe('question');
    pusherClient.bind('create:question', (data: FullQuestionType) => {
      setFilterQuestions((prev) => [...prev, data]);
    });
    pusherClient.bind('update:question', (data: FullQuestionType) => {
      setFilterQuestions((prev) => prev.map((question) => question.id === data.id ? data : question));
    });

    if (!tags && !difficulty && searchTitle==='' && sheet) {
      setFilterQuestions(sheet?.questions || []);
    }
    if (!tags && !difficulty && searchTitle !== '' && sheet) {
      setFilterQuestions(sheet?.questions.filter((question) => question.title.toLowerCase().includes(searchTitle.toLowerCase())) || []);
    }
    if (tags && !difficulty && searchTitle === '' && sheet) {
      setFilterQuestions(sheet?.questions.filter((question) => question.tags.some((tag) => tags.some((tag2) => tag2.value === tag))) || []);
    }
    if (!tags && difficulty && searchTitle === '' && sheet) {
      setFilterQuestions(sheet?.questions.filter((question) => question.difficulty === difficulty.value) || []);
    }
    if (tags && difficulty && searchTitle === '' && sheet) {
      setFilterQuestions(sheet?.questions.filter((question) => question.difficulty === difficulty.value && question.tags.some((tag) => tags.some((tag2) => tag2.value === tag))) || []);
    }
    if (!tags && difficulty && searchTitle !== '' && sheet) {
      setFilterQuestions(sheet?.questions.filter((question) => question.difficulty === difficulty.value && question.title.toLowerCase().includes(searchTitle.toLowerCase())) || []);
    }
    if (tags && !difficulty && searchTitle !== '' && sheet) {
      setFilterQuestions(sheet?.questions.filter((question) => question.title.toLowerCase().includes(searchTitle.toLowerCase()) && question.tags.some((tag) => tags.some((tag2) => tag2.value === tag))) || []);
    }
    if (tags && difficulty && searchTitle !== '' && sheet) {
      setFilterQuestions(sheet?.questions.filter((question) => question.difficulty === difficulty.value && question.title.toLowerCase().includes(searchTitle.toLowerCase()) && question.tags.some((tag) => tags.some((tag2) => tag2.value === tag))) || []);
    }
    if(!tags && !difficulty && searchTitle==='' && questionTypeFilter==='All' && sheet){
      setFilterQuestions(sheet?.questions || []);
    }
    if(!tags && !difficulty && searchTitle==='' && questionTypeFilter!=='All' && sheet){
      setFilterQuestions(sheet?.questions.filter((question) => question.questionStatus[0].status === questionTypeFilter) || []);
    }
    if(!tags && !difficulty && searchTitle!=='' && questionTypeFilter==='All' && sheet){
      setFilterQuestions(sheet?.questions.filter((question) => question.title.toLowerCase().includes(searchTitle.toLowerCase())) || []);
    }
    if(!tags && !difficulty && searchTitle!=='' && questionTypeFilter!=='All' && sheet){
      setFilterQuestions(sheet?.questions.filter((question) => question.title.toLowerCase().includes(searchTitle.toLowerCase()) && question.questionStatus[0].status === questionTypeFilter) || []);
    }
    if(!tags && difficulty && searchTitle==='' && questionTypeFilter==='All' && sheet){
      setFilterQuestions(sheet?.questions.filter((question) => question.difficulty === difficulty.value) || []);
    }
    if(!tags && difficulty && searchTitle==='' && questionTypeFilter!=='All' && sheet){
      setFilterQuestions(sheet?.questions.filter((question) => question.difficulty === difficulty.value && question.questionStatus[0].status === questionTypeFilter) || []);
    }
    if(!tags && difficulty && searchTitle!=='' && questionTypeFilter==='All' && sheet){
      setFilterQuestions(sheet?.questions.filter((question) => question.difficulty === difficulty.value && question.title.toLowerCase().includes(searchTitle.toLowerCase())) || []);
    }
    if(!tags && difficulty && searchTitle!=='' && questionTypeFilter!=='All' && sheet){
      setFilterQuestions(sheet?.questions.filter((question) => question.difficulty === difficulty.value && question.title.toLowerCase().includes(searchTitle.toLowerCase()) && question.questionStatus[0].status === questionTypeFilter) || []);
    }
    if(tags && !difficulty && searchTitle==='' && questionTypeFilter==='All' && sheet){
      setFilterQuestions(sheet?.questions.filter((question) => question.tags.some((tag) => tags.some((tag2) => tag2.value === tag))) || []);
    }
    if(tags && !difficulty && searchTitle==='' && questionTypeFilter!=='All' && sheet){
      setFilterQuestions(sheet?.questions.filter((question) => question.tags.some((tag) => tags.some((tag2) => tag2.value === tag)) && question.questionStatus[0].status === questionTypeFilter) || []);
    }
    return () => {
      pusherClient.unsubscribe('question');
      pusherClient.unbind('create:question');
      pusherClient.unbind('update:question');
    }

  


    
  }, [difficulty, sheet, tags, searchTitle,questionTypeFilter])
  
  

  

  const removeAllFilter = () => {
    setDifficulty(null);
    setTags(null);
    setSearchTitle('');
    setQuestionTypeFilter('All');
    router.push(`/sheet/${sheetId}`);
  }
  

  const questionStatuses = [
    { value: QuestionStatus.UNATTEMPTED, label: 'Unattempted' },
    { value: QuestionStatus.SOLVED, label: 'Solved' },
    { value: QuestionStatus.SKIPPED, label: 'Skipped' },
    { value: QuestionStatus.REVISED, label: 'Revised' },
    {value:'All',label:'All'}
  ]
  



  return (
    <>
      {sheetStatusModal && sheet  && <PublishStatusModal onClose={() => setSheetStatusModal(false)} sheetId={sheet.id} status={sheet.status}  />}
      {filterModal && <SheetQuestionFilter sheetId={sheetId} setDifficulty={setDifficulty} setTags={setTags} onClose={() => setFilterModal(false)} />}
      {progressModal && <ProgressModal onClose={()=>setProgressModal(false)} unattempted={unattemptedQuestions} solved={solvedQuestions} skipped={skippedQuestions} revised={revisedQuestions} />}
      {errorModal && <div className="fixed inset-0 bg-black/60 z-[99999]  flex flex-row items-center justify-center">
        <div className="bg-white  rounded p-4 flex flex-col gap-4">
          <Heading body="Error" className="text-center" />
          <SubHeading body="You are not authorized to view this sheet" className="text-center" />
          <button onClick={() => {
            router.push('/sheet');
            setErrorLoading(true);
          }} className="bg-black/90 text-white py-2 px-4 rounded">{!errorLoading ? 'Go Back To Sheet' :<Loader/>}</button>
        </div>
      </div>}
      {isAuthor && sheet && <div className="bg-black/70 rounded p-2 w-full flex flex-col justify-between z-40 xs:z-0   sticky top-16 lg:hidden gap-2 ">
            <div className="flex flex-row gap-4">
              <div className="w-1/2 ">
                <QuestionCreation sheetId={sheet.id} />
              </div>
              <div className="w-1/2 ">
                <FolderCreation sheet={sheet} />
                      </div>
            </div>
        <div className="flex flex-row items-center gap-4">
          <button className="bg-blue-600 p-3 w-1/2 rounded text-white font-semibold flex flex-row justify-center items-center  " onClick={() => setShowComments(true)}><MdComment size={20} /></button>
          <button className="bg-black text-white p-3 w-1/2 font-semibold flex flex-row items-center justify-center rounded" onClick={()=>setProgressModal(true)}>Progress</button>
        </div>
       

          </div>}
      {showComments && currentUser && <CommentModal onClose={() => setShowComments(false)} sheetId={parseInt(sheetId)} currentUserId={currentUser.id} />}
      {editSheet && <UpdateSheetModal onClose={() => setEditSheet(false)} sheet={sheet!}/>}
      {sheet ? (
        <div className="p-4 flex flex-col  h-screen overflow-hidden   w-full gap-4 xs:pb-32 bg-black text-white">
         
           
                  <div className="flex flex-row gap-3 w-full">
                    <div className="flex flex-col gap-4 w-4/5">
                      <div className="flex flex-row items-center  justify-between w-full    ">
                                  <Heading body={`${sheet.title}`} className="self-center flex-shrink-0 xs:truncate   xs:text-xl lg:text-3xl flex-1 text-center " />
                      </div>
                      <SubHeading body={`Made By :${sheet.author.name}`} className="self-center text-white xs:line-clamp-2 xs:text-sm lg:text-lg lg:overflow-visible flex-shrink-0" />
                      <div className="flex flex-row items-center gap-4 self-center text-sm ">
                          <div className="flex flex-col xs:gap-0.5 xs:text-xs lg:text-sm lg:flex-row lg:gap-4">
                            <span className="whitespace-nowrap">Created :{dateString(new Date(sheet.createdAt))}</span>
                            <span className="whitespace-nowrap">Updated :{dateString(new Date(sheet.updatedAt))}</span>
                          </div>
                          <span className="flex flex-row items-center gap-2">
                              {sheet.isPublic ? <MdPublic /> : <MdLock />}
                                    {sheet.isPublic ? "Public" : "Private"}
                                    {isAuthor && <Tooltip title='Edit Sheet' placement="top"><button className="bg-black py-2 px-4 text-white rounded flex flex-row items-center gap-2" onClick={() => setEditSheet(true)}><MdEdit /><span className="xs:sr-only lg:not-sr-only  ">Edit Sheet</span></button></Tooltip>}
                                  </span>
                    
                                </div>
                                <div className="bg-white/90 text-black w-5/6 self-center flex flex-shrink-0 flex-row p-1 rounded xs:truncatestyle-2 truncatestyle-3 xs:text-sm lg:text-lg ">
                                  {sheet.description}
                                </div>
            </div>
            <div className="flex flex-col gap-2 w-1/5   ">
              {isAuthor && <button className="bg-blue-500 py-2 px-4 rounded text-white font-semibold xs:text-sm lg:text-xl" onClick={() => handleStatusChange()}>{publishStatus}</button>}
              {isAuthor && <div className="flex flex-col gap-2  w-full xs:hidden lg:flex">
                <QuestionCreation sheetId={sheet.id} />
                <FolderCreation sheet={sheet} />
              </div>}
            </div>
                  </div>
          
                  <div className="flex flex-row  gap-6 w-full lg:pb-20 xs:pb-36    rounded items-start h-full flex-shrink-0 bg-black/60 overflow-hidden         ">
            <div className="lg:w-3/5 flex flex-col items-center bg-white/10 p-4 rounded gap-3 xs:w-full h-full overflow-y-auto   ">
              
             
              <div className="flex flex-row gap-4 items-center justify-between w-full">
                <Heading body="Questions" className="text-center" />
                <select name="questionStatus" id="questionStatus" className="py-2 px-4 rounded bg-white/20 text-black" value={questionTypeFilter} onChange={(e:any) => setQuestionTypeFilter(e.target.value as QuestionStatus)} >
                  {questionStatuses.map((status) => (
                    <option key={status.value} value={status.value} className="bg-white/10">{status.label} </option>
                  ))}
                </select>

               
              </div>
              <div className="flex flex-row items-center gap-4 w-full  ">
                <input type="text" name="" id="" className="form-input rounded py-2 px-3 w-full bg-black text-blue-600 " placeholder="Search Question By Title" onChange={(e)=>setSearchTitle(e.target.value)} value={searchTitle} />
                
              </div>
              <div className="flex flex-col gap-4 w-full  overflow-y-auto h-full   ">
                {filterQuestions.length>0 ?filterQuestions.map((question) => (
                  <QuestionCard key={question.id} question={question} sheetId={sheet.id} isAuthor={isAuthor} />
                )):<span className="bg-black p-4 text-white text-2xl text-center  justify-self-center rounded">No Questions Exist Yet</span>}
                {folders.map((folder) => (
                  <FolderCard key={folder.id} folder={folder} sheetId={sheet.id} isAuthor={isAuthor} question={filterQuestions} searchTitle={searchTitle} tags={tags} />
                  
                ))}

</div>
            </div>
            
                      <div className="lg:w-2/5 lg:flex flex-col items-center bg-white/10 p-2 rounded gap-1 xs:hidden sticky top-0 h-full  flex-shrink-0 z-50 overflow-hidden ">
              
              
              <SubHeading body='Sheet Progress' className="text-center text-white" />
              <div className="grid grid-cols-1 gap-1 p-2 bg-black/20 w-full rounded">
              <div className='flex flex-row items-center gap-1 col-span-1 text-green-500 justify-center '>
                                  <span className='w-1/2'>Solved Questions</span>
                                  <span className=' inline-flex relative'>
                                      <CircularProgresswithLabel value={solvedQuestions} variant='determinate' className='text-green-500' />
                                      <span className='absolute top-0 right-0 left-0 bottom-0 flex flex-row items-center justify-center text-xs '>{solvedQuestions}%</span>
                                  </span>
                                  
                              </div>
                              <div className='flex flex-row items-center gap-1 col-span-1 text-red-500 justify-center'>
                                  <span className='w-1/2'>Unsolved Questions</span>
                                  <span className=' inline-flex relative'>
                                      <CircularProgresswithLabel value={unattemptedQuestions} variant='determinate' className='text-red-500 justify-center' />
                                      <span className='absolute top-0 right-0 left-0 bottom-0 flex flex-row items-center justify-center text-xs '>{unattemptedQuestions}%</span>
                                  </span>
                              </div>
                              <div className='flex flex-row items-center gap-1 col-span-1 text-yellow-500 justify-center'>
                                  <span className='w-1/2'>Revised Questions</span>
                                  <span className=' inline-flex relative'>
                                      <CircularProgresswithLabel value={revisedQuestions} variant='determinate' className='text-yellow-500' />
                                      <span className='absolute top-0 right-0 left-0 bottom-0 flex flex-row items-center justify-center text-xs '>{revisedQuestions}%</span>
                                  </span>
                                  
                              </div>
                              <div className='flex flex-row items-center gap-1 col-span-1 text-orange-500 justify-center'>
                                  <span className='w-1/2'>Skipped Questions</span>
                                  <span className=' inline-flex relative'>
                                      <CircularProgresswithLabel value={skippedQuestions} variant='determinate' className='text-orange-500' />
                                      <span className='absolute top-0 right-0 left-0 bottom-0 flex flex-row items-center justify-center text-xs '>{skippedQuestions}%</span>
                                  </span>
                                  
                              </div>
              </div>

              <div className="flex flex-col gap-1 h-full overflow-y-auto w-full">
                <SubHeading body="Users" className="text-center text-white" />
                <div className="flex flex-row gap-2 items-center flex-wrap bg-white/20 py-2 rounded px-3 w-full">
                  { sheet.users.length!==0?sheet.users.map((userele) => {
                    return <div key={userele.user.id} className="flex flex-col gap-1 text-black items-center p-2 bg-blue-600 rounded-full hover:scale-110 transition duration-300  ">
                      <Image src={userele.user.image || '/images/user.png'} alt='avatar' width={20} height={20} className="h-11 w-11 rounded-full object-contain  " />
                      <span className="sr-only">{userele.user.name}</span>
                    </div>
                
                  }) : (<span className="text-black text-xl text-center w-full">No Users using the sheet yet</span>)}
                
                </div>
                <div className="flex flex-col gap-2  w-full ">
                    <button className="flex flex-row items-center gap-1 py-1 px-3 rounded bg-black text-white justify-center " onClick={()=>setFilterModal(true)}>
                      <span className="lg:not-sr-only font-semibold text-xl xs:sr-only" >Filters</span>
                      <span className="p-2 rounded-full bg-white/70 text-black "><FaFilter size={20} /></span>
                    </button>
                    <button className="bg-blue-600 text-white p-2 rounded font-semibold" onClick={()=>removeAllFilter()}>Remove All Filter</button>
                  </div>
                
                
                <button className="bg-blue-600 p-3 w-full rounded text-white font-semibold text-center self-center  " onClick={()=>setShowComments(true)}>See/Post Reviews</button>
              </div>
          

              

              
                          
                      </div>
                  
                  
          </div>
          </div>
      ) : (
        <div className="h-screen w-full flex flex-row items-center justify-center bg-black">
          <Loader />
        </div>
      )}
    </>
  );
};

export default SingleSheetPage;
