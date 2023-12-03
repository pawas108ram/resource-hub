"use client";
import Content from "@/components/Content";
import { Solution } from "@prisma/client";
import { Clipboard } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { MdCopyAll } from "react-icons/md";
import clsx from "clsx";
import { ComplexityToO } from "@/app/libs/utility functions/complexityToO";
import SubHeading from "@/components/SubHeading";

const MainSolutionComponent = ({ sol }: { sol: Solution }) => {
  const [copy, setCopy] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopy(true);
      toast.success("Code Copied Successfully");
      setTimeout(() => {
        setCopy(false);
      }, 1000);
    });
  };
  return (
    <div className="flex flex-col p-2 bg-gray-400/20 rounded gap-2 text-white">
      <SubHeading body="Approach" className="underline xs:text-base lg:text-lg" />
      <pre className="text-sm font-semibold bg-black/40 py-1 px-4 rounded xs:text-sm lg:text-base whitespace-break-spaces">
        {sol.body}
      </pre>
      <button
        className="text-blue-600 text-sm py-1 px-4 "
        onClick={() => setShowCode((prev) => !prev)}
      >
        {showCode ? "Hide Code" : "Show Code"}
      </button>
      {showCode && (
        <div className=" flex flex-col gap-2">
          <SubHeading body="Complexities" className="underline xs:text-base lg:text-lg" />
          <div className="flex flex-row items-center gap-4 p-2 rounded  text-black">
            <span className="bg-gray-400 py-1 px-3 rounded font-semibold xs:text-sm lg:text-base ">
              TC:{ComplexityToO(sol.timeComplexity)}
            </span>
            <span className="bg-gray-400 py-1 px-3 rounded font-semibold xs:text-sm lg:text-base">
              SC:{ComplexityToO(sol.spaceComplexity)}
            </span>
          </div>
          <SubHeading body="Solution Code" className="underline xs:text-base lg:text-lg " />
          <div className="relative">
            <pre className="text-sm  font-semibold tracking-wide bg-black/60 py-1 px-2 rounded w-full whitespace-break-spaces ">
              {sol.code}
            </pre>
            <button
              className={clsx(
                "absolute top-5 right-5 p-1 bg-gray-200 rounded-full text-black hover:scale-105 transition duration-300 xs:hidden",
                copy && "bg-green-600 text-white"
              )}
              onClick={() => handleCopy(sol.code)}
            >
              <Clipboard />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainSolutionComponent;
