import React from 'react'
interface HeadingProps{
    body: string;
}

const Heading:React.FC<HeadingProps> = ({body}) => {
  return (
      <span className='text-4xl font-bold'>{body}</span>
  )
}

export default Heading
