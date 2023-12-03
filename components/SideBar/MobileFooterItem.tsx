import React from 'react'
import { IconType } from 'react-icons';
import clsx from 'clsx';
import Link from 'next/link';
import { Tooltip } from '@mui/material';
interface MobileFooterItemProps {
    label: String;
    href: string;
    icon: IconType
    isActive?: boolean;
    onClick?: () => void;

}

const MobileFooterItem: React.FC<MobileFooterItemProps> = ({ label, href, onClick, isActive, icon: Icon }) => {
    const handleClick = () => {
        if(onClick){
            return onClick();
        }
    }
  return (
      <Tooltip title={label} placement='top-start'>
          <Link href={href} onClick={handleClick} className={clsx(`rounded-full p-3 transition duration-500`,isActive?'bg-black text-white scale-110 hover:scale-125 hover:bg-white/40 hover:text-black':'bg-gray-500 hover:text-white hover:bg-black/50 hover:scale-110' )}><Icon size={24} /><span className='sr-only'>{label}</span></Link>
      </Tooltip>
  )
}

export default MobileFooterItem
