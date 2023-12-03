import Heading from '@/components/Heading'
import SubHeading from '@/components/SubHeading'
import Image from 'next/image'
import React from 'react'
import logo from '../favicon.ico'
import AuthForm from './components/AuthForm'

const AuthenticationPage = () => {
  return (
      <div className='flex flex-col gap-4 items-center justify-center min-h-screen w-full xs:mx-auto text-center xs:pb-12 bg-black text-white '>
         
          <Heading body="Resource Hub" />
          <SubHeading body="Resource Hub is all in one platform for all your resource needs related to Tech" className='xs:hidden md:block' />
          <AuthForm />
    </div>
  )
}

export default AuthenticationPage
