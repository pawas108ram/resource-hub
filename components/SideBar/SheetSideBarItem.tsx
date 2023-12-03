import React from "react";
import { Sheet } from "@prisma/client";
import { GiPublicSpeaker } from "react-icons/gi";
import { AiFillLock } from "react-icons/ai";
import Link from "next/link";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import toast from "react-hot-toast";

import { MdDelete, MdSettings } from "react-icons/md";
import { DeleteSheet } from "@/app/_actions/DeleteSheet";
import SettingButton from "../buttons/SheetSettingButton";
import { Tooltip } from "@mui/material";
import { FullSheetType } from "@/app/(dashboard-layout)/resource/layout";
interface SheetSideBarItemProps {
  sheet?: FullSheetType;

  userSheet?: FullSheetType;
}

const SheetSideBarItem: React.FC<SheetSideBarItemProps> = ({
  sheet,
  userSheet,
}) => {
  const handleLike = async () => {
    const res = await fetch("/api/sheets/like", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sheetId: sheet?.id || userSheet?.id,
      }),
    })
      .then(() => toast.success("Liked"))
      .catch((err) => toast.error(err.response.data));
  };
  const handleDislike = async () => {
    const res = await fetch("/api/sheets/dislike", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sheetId: sheet?.id || userSheet?.id,
      }),
    })
      .then(() => toast.success("Disliked"))
      .catch((err) => toast.error(err.response.data));
  };
  return (
    <>
      {(sheet || userSheet) && (
        <div className="flex flex-col p-2 bg-gray-100 gap-1 border-[1px] border-black rounded    ">
          <span className="flex flex-row items-center gap-4 w-full justify-between">
            {sheet?.isPublic || userSheet?.isPublic ? (
              <GiPublicSpeaker size={20} />
            ) : (
              <AiFillLock size={20} />
            )}
            <span className="text-md font-semibold">
              {sheet?.isPublic || userSheet?.isPublic ? "Public" : "Private"}
            </span>

            {sheet && <SettingButton sheet={sheet!} />}
            {userSheet && (
              <button
                className="bg-black text-white p-3 rounded-full"
                onClick={() => DeleteSheet(userSheet.id)}
              >
                <MdDelete />
              </button>
            )}
          </span>
          <div className="flex flex-row flex-wrap gap-4">
            <Link
              href={`/sheet/${sheet?.id || userSheet?.id}`}
              className="text-sm font-semibold rounded truncate"
            >
              {sheet?.title || userSheet?.title}
            </Link>
          </div>

          <span className="text-sm">
            {(sheet?.description?.length != undefined &&
            sheet.description.length > 20
              ? `${sheet.description?.slice(0, 40)}...`
              : sheet?.description) ||
              (userSheet?.description?.length != undefined &&
              userSheet.description.length > 20
                ? userSheet.description?.slice(0, 40)
                : userSheet?.description)}
          </span>
          {userSheet && (
            <div className="flex flex-col gap-2">
              <div className="flex flex-row w-full  items-center  gap-6 ">
                <Tooltip title="Like Button" placement="top-start">
                  <button
                    className="bg-green-500 p-1 rounded-full"
                    onClick={() => handleLike()}
                  >
                    <ThumbsUp />
                  </button>
                </Tooltip>
                <Tooltip title="Dislike Button" placement="top-start">
                  <button
                    className="bg-red-500 p-1 rounded-full"
                    onClick={() => handleDislike()}
                  >
                    <ThumbsDown />
                  </button>
                </Tooltip>
              </div>
            </div>
          )}
          {sheet && (
            <div className="flex flex-col gap-2">
              <div className="flex flex-row w-full  items-center  gap-6 ">
                <span className=" flex flex-row items-center gap-2">
                  <span className="p-1 bg-green-500 rounded-full">
                    <ThumbsUp />
                  </span>
                  : {sheet.dislikes?.length || "0"}
                </span>
                <span className=" flex flex-row items-center gap-2">
                  <span className="bg-red-500 p-1 rounded-full">
                    <ThumbsDown />
                  </span>
                  : {sheet.likes?.length || "0"}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default SheetSideBarItem;
