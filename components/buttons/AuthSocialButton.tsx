import React from 'react'
import {IconType} from 'react-icons'
import clsx from 'clsx';
interface AuthSocialButtonProps{
    icon: IconType;
  onClick: () => void;
  isGoogle?: boolean;
}

const AuthSocialButton:React.FC<AuthSocialButtonProps> = ({icon:Icon,onClick,isGoogle}) => {
  return (
  <button type='button' onClick={onClick} className={clsx('inline-flex w-4/5  justify-center rounded  px-4 py-1 text-black shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0 ',isGoogle?'bg-red-600 text-white hover:bg-red-500 ':'bg-white')}><Icon size={32}/></button>
  )
}

export default AuthSocialButton
