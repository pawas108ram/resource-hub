
import clsx from 'clsx';
import Link from 'next/link';
import React from 'react'
import { IconType } from 'react-icons';
import Tooltip from '@mui/material/Tooltip';
interface QuestionNavbarElementProps{
    label: string;
    href: string;
    icon: IconType;
    isActive: boolean;
}

const QuestionNavbarElement:React.FC<QuestionNavbarElementProps> = ({label,href,icon:Icon,isActive}) => {
  return (
 <Tooltip title={label} placement="bottom-end">
      <Link href={href} className={clsx('flex flex-col gap-1 bg-black/20 text-white p-3 rounded hover:scale-110 transition duration-300 hover:bg-black/40 items-center w-1/5 ',isActive &&  'scale-110 bg-black/60 hover:scale-110 hover:bg-black/60 ring-2 ring-white')}>
        <Icon size={16} />
        <span className='xs:hidden lg:flex'> {label}</span>
      </Link>
      </Tooltip>
    
  )
}

export default QuestionNavbarElement
