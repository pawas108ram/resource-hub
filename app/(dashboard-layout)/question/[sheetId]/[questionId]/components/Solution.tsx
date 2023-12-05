"use client";

import Content from "@/components/Content";

import { Solution, SolutionType } from "@prisma/client";

import React, { useEffect, useState } from "react";
import { AiFillDownCircle, AiFillUpCircle } from "react-icons/ai";
import SolutionContent from "./SolutionContent";

const SolutionBody = ({
  type,
  solution
  
}: {
  type: SolutionType;
    solution: Solution[] | null;
  
 
}) => {
  const [showSolution, setShowSolution] = useState(false);
  const [typedSolution, setTypedSolution] = useState<Solution | null>(null);
  useEffect(() => {
    if (solution !== null) {
      const sol = solution.filter((sol) => sol.type === type);
      if (sol.length > 0) {
        setTypedSolution(sol[0]);
      } else {
        setTypedSolution(null);
      }
    }
  }, [solution, type]);
 
  
 
  

  return (
    <div  className="flex flex-col gap-3">
      <div className="flex flex-row justify-between  bg-white/90 text-black rounded  p-3">
        <Content body={type} className="xs:text-base lg:text-lg" />
        <button
          className="p-2 rounded-full bg-black     font-extrabold shadow"
          onClick={() => setShowSolution((prev) => !prev)}
        >
          {showSolution ? (
            <AiFillUpCircle size={24} color="white"  />
          ) : (
            <AiFillDownCircle size={24} color="white" />
          )}
        </button>
      </div>
      {showSolution &&
        (typedSolution!==null ? (
          <SolutionContent key={typedSolution.id} sol={typedSolution} />
        ) : (
          <span>No personal solution of type {type} created Yet</span>
        ))}
    </div>
  );
};

export default SolutionBody;
