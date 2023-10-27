import React from 'react'
import { IconType } from 'react-icons';
import clsx from 'clsx';
import Link from 'next/link';


interface DesktopSidebarItemProps {
    label: string;
    href: string;
    icon: IconType;
    isActive?: boolean;
    onClick?: () => void;


}
const DesktopSidebarItem: React.FC<DesktopSidebarItemProps> = ({ href, label, icon: Icon, isActive, onClick }) => {
    const handleClick = () => {
        if (onClick) {
            return onClick();
        }
    }
  return (
      <div className=''>
          <Link href={href} onClick={handleClick} className={clsx(`hover:scale-125 hover:bg-black/80  rounded hover:text-white duration-300 p-3 transition inline-block`,
          isActive? 'bg-black/90 text-white  scale-125':'bg-gray-500 hover:scale-110 ')}> <Icon size={24} /><span className='sr-only'>{label}</span></Link>
          
      
    </div>
  )
}

export default DesktopSidebarItem
