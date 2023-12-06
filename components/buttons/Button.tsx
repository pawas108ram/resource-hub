'use client'
import clsx from "clsx"
interface Buttonprops{
    type?:'button'|'submit'|'reset'| undefined;
    fullWidth?:boolean;
    children:React.ReactNode;
    onClick?:()=>void;
    secondary?:boolean;
    danger?:boolean;
    disabled?:boolean
}

const Button:React.FC<Buttonprops> = ({type,fullWidth,children,onClick,secondary,danger,disabled}) => {
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={clsx(`flex justify-center rounded-md p-4 text-md font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 whitespace-nowrap`,disabled && 'opacity-50 cursor-default',fullWidth && 'w-4/5',secondary?'text-white':'text-white',danger && 'bg-rose-500 hover;bg-rose-600 focus-visible:outline-rose-600',!secondary && !danger && 'bg-blue-600 hover:bg-sky-600 focus-visible:outline-sky-600')}>{children}</button>
  )
}

export default Button