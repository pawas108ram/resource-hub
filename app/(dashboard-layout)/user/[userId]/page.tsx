'use client'
import { pusherClient } from '@/app/libs/pusher'
import Content from '@/components/Content'
import Heading from '@/components/Heading'
import Loader from '@/components/Loader'
import SubHeading from '@/components/SubHeading'
import { Comment, Resource, ResourceDislikes, ResourceLikes, ResourceUser, Sheet, SheetDislikes, SheetLikes, SheetUser, User } from '@prisma/client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

const UserProfilePage = ({params}:{params:{userId:string}}) => {
    // id Int @id @default(autoincrement())
    // name String?
    // hashedPassword String?
    // bio String?
    // portfolio String?
    // email String? @unique
    // image String?
    // createdAt DateTime @default(now())
    // updatedAt DateTime @updatedAt
    // emailVerified DateTime?
    // profileLink String @unique @default(cuid())
    
    // accounts Account[]
    // ownSheet Sheet[]
    // sharedSheet SheetUser[]
    // ownResource Resource[]
    // sharedResource ResourceUser[]
    // requestMaker Request[] @relation("RequestMaker")
    // requestReciever Request[] @relation("RequestReciever")
    // ownComments Comment[]
    
    // sheetsLikes SheetLikes[]
    // resourceLikes ResourceLikes[]
    // sheetDislikes SheetDislikes[]
    // resourceDislikes ResourceDislikes[]
    // commentLikes CommentLikes[]
    // commentDislikes CommentDislikes[]
    // questionLikes QuestionLikes[]
    // questionDislikes QuestionDislikes[]
    // questionSolutionLikes Solution[]
    // solutionDislikes SolutionDislikes[]
    // solutionLikes SolutionLikes[]
    // seenSolutions SolutionViews[]
    // questionStatus QuestionUserStatus[]
    // tasks TaskUserStatus[]
    // coins Int @default(400)
    // keys Int @default(3)
    type UserInfo = User & {
        ownSheet: Sheet[]
        sharedSheet: SheetUser[]
        ownResource: Resource[]
        sharedResource: ResourceUser[]
        ownComments: Comment[]
        sheetsLikes: SheetLikes[]
        resourceLikes: ResourceLikes[],
        sheetDislikes: SheetDislikes[],
        resourceDislikes: ResourceDislikes[],
    }
 
  const [user, setUser] = useState<UserInfo | null>(null);
  useEffect(() => {
    (async () => {
      const fetchUser = await fetch(`/api/user/${params.userId}`).then((res) => res.json());
      setUser(fetchUser);
    })();
  }, [params.userId])
  useEffect(() => {
    pusherClient.subscribe('user');
    pusherClient.bind('user:update', async () => {
      const fetchUser = await fetch(`/api/user/${params.userId}`).then((res) => res.json());
      if (fetchUser) {
        setUser(fetchUser);
        console.log(fetchUser);
      }
     
     
    })
    return () => {
      pusherClient.unsubscribe('user');
      pusherClient.unbind('user:update');
    }
  },[params.userId,user])

  return (
      <div className='flex flex-col items-center justify-center h-screen w-full bg-black/90 text-white gap-6 xs:gap-3 '>
          <Heading body='User Profile' className='text-white underline' />
          {user ? <div className='flex flex-row lg:w-3/5 xs:w-full rounded p-2 bg-white gap-2 text-black '>
              <div className='flex flex-col outline-black outline outline-2 w-3/5 p-2 xs:p-0  gap-3 '>
                    <SubHeading body='User Stats' className=' underline font-semibold' />
                  
                  <div className='grid grid-cols-1  gap-0.5 rounded p-2 lg:text-lg xs:text-xs  font-semibold '>
                      <div className='flex flex-row items-center justify-between  px-3'>
                          <span >Sheets Made</span>
                            <span >{user.ownSheet.length} sheets</span>
                      </div>
                        <div className='flex flex-row items-center justify-between  px-3'>
                            <span >Sheets Shared</span>
                          <span >{user.sharedSheet.length} sheets</span>
                      </div>
                        <div className='flex flex-row items-center justify-between  px-3'>
                            <span >Resources Made</span>
                          <span >{user.ownResource.length} resources</span>
                      </div>
                        <div className='flex flex-row items-center justify-between  px-3'>
                            <span >Resources Shared</span>
                          <span >{user.sharedResource.length} resources</span>
                      </div>
                        <div className='flex flex-row items-center justify-between  px-3'>
                            <span >Comments Made</span>
                          <span >{user.ownComments.length} comments</span>
                      </div>
                        <div className='flex flex-row items-center justify-between  px-3'>
                            <span >Sheets Liked</span>
                          <span >{user.sheetsLikes.length} likes</span>
                      </div>
                      <div className='flex flex-row items-center justify-between  px-3'>
                            <span >Sheets Disliked</span>
                            <span >{user.sheetDislikes.length} dislikes</span>
                      </div>
                        <div className='flex flex-row items-center justify-between  px-3'>
                                <span >Resources Liked</span>
                          <span >{user.resourceLikes.length} likes</span>
                      </div>
                        <div className='flex flex-row items-center justify-between  px-3'>
                                <span >Resources Disliked</span>
                          <span >{user.resourceDislikes.length} dislikes</span>
                      </div>
                      <div className='flex flex-row items-center justify-between px-3'>
                            <span >Coins</span>
                            <span >{user.coins} coins</span>
                      </div>
                        <div className='flex flex-row items-center justify-between px-3'>
                                <span >Keys </span>
                          <span >{user.keys} keys</span>
                          </div>
                      
                      
                 </div>
              </div>
              <div className='flex flex-col outline-black outline outline-2 w-2/5 gap-1 items-center p-2'>
                  <div className='h-48 w-48 xs:h-24 xs:w-24 rounded-full bg-black flex flex-col items-center justify-center'>
                    <Image src={user.image || '/images/user.png'} height={150} width={150} className='rounded-full p-1 bg-blue-500 object-fill lg:h-48 lg:w-48 xs:h-24 xs:w-24 ' alt='user-image ' />
                  </div>
                  <span className='text-lg font-semibold'>{user.name}</span>
                  <SubHeading body='Bio' className=' font-semibold underline' />
                  <span className='w-full p-2 border-2 border-black bg-black xs:text-xs lg:text-sm line-clamp-4 text-white rounded h-full xs:overflow-y-auto '>{user.bio}</span>
                  
              </div>
          </div> : <div className='flex flex-col items-center justify-center w-full h-full '>
              <Loader />
                <span>Loading...</span>
          </div>}
      
    </div>
  )
}

export default UserProfilePage
