import Heading from '@/components/Heading';
import React from 'react'
import QuestionNavbar from './components/QuestionNavbar';
import CodeComponent from './components/CodeComponent';
import { getQuestion } from '@/app/_actions/getQuestionById';
import { getCurrentUser } from '@/app/_actions/getCurrentUser';
import { FullQuestionType } from './page';
import Loader from '@/components/Loader';


const QuestionLayout = async ({ params, children }: { params: { questionId: string, sheetId: string }, children: React.ReactNode }) => {
  const currentUser = await getCurrentUser();
  let question: (FullQuestionType | null) = null;
  if (currentUser) {
    
    question = await getQuestion(params.questionId, currentUser.id);
  }
    
    
  return (
    <>
      {question?
        <div className='bg-black/90 w-full min-h-screen flex flex-row gap-6 p-4 lg:z-40 xs:z-0  '>
            <div className='flex flex-col lg:w-3/5 bg-white/10 lg:p-4 gap-4 xs:w-full xs:pb-44 max-h-screen  '>
                <QuestionNavbar questionId={question.id} sheetId={params.sheetId} />
               <div className='max-h-full h-full overflow-hidden '> {children}</div>
            </div>
            <div className='flex flex-col w-2/5 bg-white/10 p-4 gap-4 rounded text-white xs:hidden lg:flex max-h-screen sticky top-0   '>
      
                    <Heading body='Post your Approach' className=' border-b-4 border-white p-2 ' />
                    <CodeComponent questionId={question.id} />
      
            </div>
      
      </div>:<Loader/>}
    </>
  )
}

export default QuestionLayout
