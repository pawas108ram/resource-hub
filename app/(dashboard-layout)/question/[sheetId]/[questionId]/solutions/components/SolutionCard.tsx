import React from "react";
import { UserSolutionType } from "../page";
import Image from "next/image";
import { dateString } from "@/app/libs/utility functions/dateString";
import { ComplexityToO } from "@/app/libs/utility functions/complexityToO";
import { SolutionType } from "@prisma/client";
import clsx from "clsx";
import Link from "next/link";
import { BiSolidDislike, BiSolidLike } from "react-icons/bi";
import { IoEyeOutline } from "react-icons/io5";
export function handleTypeColor(type: SolutionType){
  switch (type)
  {
    case 'BruteForce':
      return 'text-red-500';
    case 'Optimal':
      return 'text-blue-500';
    case 'Optimum':
      return 'text-green-500';
    default:
      return 'text-gray-500';
  }
}

const SolutionCard = ({ solution ,sheetId,questionId}: { solution: UserSolutionType ,questionId:string ,sheetId:string}) => {
  return (
    <Link href={`/question/${sheetId}/${questionId}/solution/${solution.id}`} className="bg-black py-2 px-3 rounded w-full text-white flex flex-row gap-3 items-start ">
      <Image
        src={solution.author.image || "/images/user.png"}
        alt="user"
        width={40}
        height={40}
        className="rounded-full p-1 bg-white"
      />
      <div className="flex flex-col gap-0.5 w-full">
        <div className="grid grid-cols-12 xs:gap-x-1 w-full xs:text-xs xl:text-sm">
          <span className="xs:col-span-4 xl:col-span-3 truncatestyle-1">{solution.author.name}</span>
         
          <span className="xs:col-span-3 xl:col-span-2">TC:{ ComplexityToO(solution.timeComplexity)}</span>
          <span className="xs:col-span-3 xl:col-span-2">SC:{ComplexityToO(solution.spaceComplexity)}</span>
          <span className="xs:col-span-2 xl:col-span-2">{solution.language}</span>
          <span className="xl:flex flex-col gap-0.5 xl:col-span-3 text-sm xs:hidden ">
            <span>Created:{dateString(new Date(solution.createdAt))}</span>
            <span>Updated:{dateString(new Date(solution.updatedAt))}</span>
          </span>
          
          
        </div>
        <span className="xs:text-sm font-bold underline ">{solution.title}</span>
        <span className="bg-white/20 rounded xs:text-sm xs:py-1 xs:px-2 truncatestyle-1">{solution.body}</span>
        <div className="flex flex-row xs:items-center xs:justify-around xs:py-1 xs:px-2 lg:justify-start lg:gap-4  ">
          <span className="flex flex-row items-center gap-1 text-green-500"><BiSolidLike />{solution.likes?.length || 0}</span>
          <span className="flex flex-row items-center gap-1 text-red-500"><BiSolidDislike />{solution.dislikes?.length || 0}</span>
          <span className="flex flex-row items-center gap-1 text-gray-200"><IoEyeOutline/>{solution.seenBy?.length || 0}</span>
        </div>
      </div>
      
    </Link>
  );
};

export default SolutionCard;
