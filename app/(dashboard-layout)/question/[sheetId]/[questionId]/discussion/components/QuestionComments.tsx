"use client";
import React, { useEffect, useState } from "react";

import QuestionComment from "./QuestionComment";
import { User } from "@prisma/client";
import { pusherClient } from "@/app/libs/pusher";

import { QuestionCommentType } from "../page";

const QuestionComments = ({
  questionId,
  sheetId,
  currentUser,
}: {
  questionId: string;
  sheetId: string;
  currentUser: User;
}) => {
  const [questionComments, setQuestionComments] = useState<
    QuestionCommentType[]
  >([]);

  useEffect(() => {
    const fetchComments = async () => {
      const res = await fetch("/api/comment/question/" + questionId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        setQuestionComments(data);
      } else {
        console.log("error");
      }
    };
    fetchComments();
  }, [questionId]);

  useEffect(() => {
    pusherClient.subscribe(`question-${questionId}`);
    pusherClient.subscribe("comment");
    pusherClient.bind("create:comment", (data: QuestionCommentType) => {
      setQuestionComments((prev) => [data, ...prev]);
    });
    pusherClient.bind("delete:comment", (data: number) => {
      setQuestionComments((prev) =>
        prev.filter((comment) => comment.id !== data)
      );
    });

    
    
    return () => {
      pusherClient.unsubscribe(`question-${questionId}`);
      pusherClient.unsubscribe("comment");
      pusherClient.unbind("create:comment");
    
      pusherClient.unbind("delete:comment");
    };
  }, [questionId]);

  return (
    <>
      {questionComments && questionComments.length > 0 ? (
        <div className="flex flex-col gap-1 p-2 bg-black/80 rounded max-h-full overflow-y-auto ">
          {questionComments.map((comment) => (
            <QuestionComment
              key={comment.id}
              comment={comment}
              questionId={parseInt(questionId)}
              isReply={false}
              currentUser={currentUser}
            />
          ))}
        </div>
      ) : (
        <span className="bg-black text-white p-2 rounded text-center text-2xl font-semibold ">
          No Discussion Started Yet{" "}
        </span>
      )}
    </>
  );
};

export default QuestionComments;
