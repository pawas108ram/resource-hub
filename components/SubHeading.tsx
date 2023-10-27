import React from 'react'
import clsx from 'clsx';

interface SubHeadingProps{
  body: string;
  className?: string;
}

const SubHeading:React.FC<SubHeadingProps> = ({body,className}) => {
  return (
    <span className={clsx(`text-2xl font-semibold`,className)}>{body}</span>
  )
}

export default SubHeading
