import React from 'react'
import clsx from 'clsx';

interface HeadingProps{
  body: string;
  className?: string;
}

const Heading:React.FC<HeadingProps> = ({body,className}) => {
  return (
    <span className={clsx(`text-4xl font-bold`,className)}>{body}</span>
  )
}

export default Heading
