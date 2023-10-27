import React from 'react'
import {IconType} from 'react-icons'
interface AuthSocialButtonProps{
    icon: IconType;
    onClick: () => void;
}

const AuthSocialButton:React.FC<AuthSocialButtonProps> = ({icon:Icon,onClick}) => {
  return (
    <button type='button' onClick={onClick} className="inline-flex w-4/5  justify-center rounded bg-gray-400 px-4 py-1 text-black shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0 "><Icon size={32}/></button>
  )
}

export default AuthSocialButton
