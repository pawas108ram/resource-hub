"use client";
import { getQuestion } from "@/app/_actions/getQuestionById";
import { dateString } from "@/app/libs/utility functions/dateString";

import SubHeading from "@/components/SubHeading";
import {
  Difficulty,
  Question,
  QuestionDislikes,
  QuestionLikes,

  QuestionUserStatus,
  Solution,

  User,
} from "@prisma/client";
import clsx from "clsx";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import EditQuestionComponent from "./components/EditQuestionComponent";


import { getSheetAuthor } from "@/app/_actions/getSheetAuthor";

import HandleLIkeComponent from "./components/HandleQuestionLikeDislike";

import Loader from "@/components/Loader";
import QuestionStatusManager from "./components/QuestionStatusManager";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/app/libs/pusher";

import SolutionComponent from "./components/SolutionComponent";
import { set } from "zod";

const difficultyColor = (difficulty: Difficulty) => {
  switch (difficulty) {
    case "Recruit":
      return "bg-green-500";
    case "Elite":
      return "bg-blue-500";
    case "Veteran":
      return "bg-orange-500";
    case "Legendary":
      return "bg-red-500";
  }
};
export type FullQuestionType = Question & {
  likes: QuestionLikes[];
  dislikes: QuestionDislikes[];
  solutions: Solution[];
  questionStatus: QuestionUserStatus[];
};

const QuestionPage = ({
  params,
}: {
  params: { questionId: string; sheetId: string };
}) => {
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [question, setQuestion] = useState<FullQuestionType | null>(null);
  const [isAuthor, setIsAuthor] = useState(false);
  const [solutions, setSolutions] = useState<Solution[] | null>(null);
  

  const session = useSession();
  const email = session?.data?.user?.email;

  useEffect(() => {
    if (email === undefined) return;

    (async () => {
      const currentUsers = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }).then((res) => res.json());
      const sheetAuthors = await getSheetAuthor(params.sheetId);
      
      setCurrentUser(currentUsers);
      if (currentUsers?.id === sheetAuthors?.id) {
        setIsAuthor(true);
      }
    })();
  }, [params.sheetId, email]);
  useEffect(() => {
    if (currentUser && currentUser.id && params.questionId) {
      (async () => {
        const questions = await getQuestion(params.questionId, currentUser?.id);
        setQuestion(questions);
        setSolutions(questions.solutions);
       
      })();
    }
    pusherClient.subscribe("question");
    pusherClient.bind("update:question", (data: FullQuestionType) => {
      setQuestion(data);
    });
    pusherClient.subscribe(`question-${params.questionId}`);
    pusherClient.bind('create:solution', (data: FullQuestionType) => {
      setQuestion(data);
      setSolutions(data.solutions);
    });
    pusherClient.bind('update:solution', (data: Solution) => {
      setSolutions((prev) => {
        if (prev === null) return null;
        const index = prev.findIndex((sol) => sol.id === data.id);
        if (index === -1) return prev;
        const newSolutions = [...prev];
        newSolutions[index] = data;
        return newSolutions;
      });
    })
    if (question) {
      pusherClient.bind('delete:solution', (data: number) => {
        setSolutions(question?.solutions.filter((sol) => sol.id !== data))
    })
    }
    

    return () => {
      pusherClient.unsubscribe("question");
      pusherClient.unbind("update:question");
      pusherClient.unsubscribe(`question-${params.questionId}`);
      pusherClient.unbind('create:solution');
      pusherClient.unbind('update:solution');
      pusherClient.unbind('delete:solution');
    };
  }, [params.questionId, currentUser,solutions,question]);


  return (
    <>
      {question != null && solutions ? (
        <div
          className={clsx(
            "  flex flex-col w-full rounded text-white gap-4  p-4 h-full overflow-y-auto bg-black/30     "
          )}
        >
          <SubHeading
            body={question.title}
            className="border-b-4 border-white truncatestyle-2 flex-shrink-0"
          />
          {isAuthor && (
            <EditQuestionComponent
              question={question}
              sheetId={params.sheetId}
            />
          )}

          <div className="flex flex-row items-center lg:gap-4  p-2 lg:text-sm xs:justify-center w-full xs:gap-2 xs:text-xs ">
            <div className="flex xs:flex-col xs:gap-y-0.5 lg:flex-row lg:gap-4">
              <span className="whitespace-nowrap">
                Created:{dateString(new Date(question.createdAt))}
              </span>
              <span className="whitespace-nowrap">
                Updated:{dateString(new Date(question.updatedAt))}
              </span>
            </div>
            <span
              className={clsx(
                "py-1 px-4 rounded",
                difficultyColor(question.difficulty)
              )}
            >
              {question.difficulty}
            </span>
            {question && <HandleLIkeComponent question={question} />}
          </div>
          <QuestionStatusManager question={question} />
          <SubHeading
            body="Question Links"
            className="underline underline-offset-2"
          />
          <div className="flex flex-col gap-3 bg-black p-2 rounded text-white ">
            {question.links.map((link, ind) => (
              <div
                className="flex flex-row items-center gap-3 w-full xs:text-xs lg:text-base "
                key={`link-${ind}`}
              >
                <span className="whitespace-nowrap">Link-{ind + 1}:</span>

                <Link className="text-blue-600 truncatestyle-1   " href={link}>
                  {link}
                </Link>
              </div>
            ))}
          </div>
         <SolutionComponent solutions={solutions} />

          <div className="flex flex-col gap-2 bg-white/50 p-1 w-full rounded items-center ">
            <SubHeading body="Topic Tags" />
            <div className="flex flex-row items-center gap-3  ">
              {question.tags.slice(0, 5).map((tag) => (
                <span
                  key={tag}
                  className="bg-black/60 text-white py-2 px-6 rounded text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <span className="flex flex-row items-center justify-center h-screen w-full text-black">
          <Loader />
        </span>
      )}
    </>
  );
};

export default QuestionPage;
