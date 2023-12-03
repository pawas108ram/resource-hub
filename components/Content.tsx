import React from 'react'
import clsx from 'clsx';

interface ContentProps{
  body: string;
  className?: string;
}

const Content:React.FC<ContentProps> = ({body,className}) => {
  return (
    <span className={clsx(`text-lg font-bold`,className)}>{body}</span>
  )
}

export default Content
