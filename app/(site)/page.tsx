import Heading from '@/components/Heading'
import SubHeading from '@/components/SubHeading'
import Image from 'next/image'
import React from 'react'
import logo from '../favicon.ico'
import AuthForm from './components/AuthForm'

const AuthenticationPage = () => {
  return (
      <div className='flex flex-col gap-4 items-center justify-center min-h-screen lg:w-full xs:w-4/5 xs:mx-auto text-center'>
          <Image src={logo} alt='logo' width={200} height={200} className='xs:hidden md:block'/>
          <Heading body="Resource Hub" />
          <SubHeading body="Resource Hub is all in one platform for all your resource needs related to Tech" className='xs:hidden md:block' />
          <AuthForm />
    </div>
  )
}

export default AuthenticationPage
