
import { DeleteResource } from "@/app/_actions/DeleteResource";
import { DeleteSheet } from "@/app/_actions/DeleteSheet";
import { dateString } from "@/app/libs/utility functions/dateString";
import { Resource, Sheet } from "@prisma/client";
import { PackagePlus, Pencil, ThumbsDown, ThumbsUp } from "lucide-react";
import Link from "next/link";
import React from "react";
import toast from "react-hot-toast";
import { MdDelete, MdPublic } from "react-icons/md";
import { RiGitRepositoryPrivateFill } from "react-icons/ri";
import SettingButton from "../buttons/SheetSettingButton";
import { FullResourceType, FullSheetType } from "@/app/(dashboard-layout)/resource/layout";
import ResourceSetting from "@/app/(dashboard-layout)/resource/components/ResourceSetting";

interface MobileSheetSideBarItemProps {
  resource?: FullResourceType;
  sheet?: FullSheetType;
  usersheet?: FullSheetType;
  userresource?: FullResourceType;
}

const MobileSheetSideBarItem: React.FC<MobileSheetSideBarItemProps> = ({
  resource,
  sheet,
  userresource,
  usersheet,
}) => {
  const handleLike = async () => {
    const res = await fetch(
      `/api/${sheet || usersheet ? "sheets" : "resources"}/like`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sheetId: sheet?.id || usersheet?.id,
          resourceId: resource?.id || userresource?.id,
        }),
      }
    )
      .then(() => toast.success("Liked"))
      .catch((err) => toast.error(err.response.data));
  };
  const handleDislike = async () => {
    const res = await fetch(
      `/api/${sheet || usersheet ? "sheets" : "resources"}/dislike`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sheetId: sheet?.id || usersheet?.id,
          resourceId: resource?.id || userresource?.id,
        }),
      }
    )
      .then(() => toast.success("Disliked"))
      .catch((err) => toast.error(err.response.data));
  };
  return (
    <>
      {(resource || userresource) && (
        <span className="flex flex-col items-center justify-center gap-2 p-3 bg-white/10 rounded w-full">
          <Link
            href={`/resource/${resource?.id || userresource?.id}`}
            className="text-lg"
          >
            {resource?.title || userresource?.title}
          </Link>
          <span className="flex flex-row justify-around w-full items-center text-xs ">
            <div className="flex flex-row items-center gap-2 text-base">
              <span>
                {resource?.isPublic || userresource?.isPublic ? (
                  <MdPublic />
                ) : (
                  <RiGitRepositoryPrivateFill />
                )}
              </span>
              <span>
                {resource?.isPublic || userresource?.isPublic
                  ? "Public"
                  : "Private"}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="flex flex-row items-center gap-1">
              <span>Created:</span>
                {userresource
                  ? dateString(new Date(userresource.createdAt))
                  : dateString(new Date(resource?.createdAt || ""))}
              </span>
              <span className="flex flex-row items-center gap-1">
                <span>Updated:</span>
                {userresource
                  ? dateString(new Date(userresource.updatedAt))
                  : dateString(new Date(resource?.updatedAt || ""))}
              </span>
            </div>
          </span>
          {userresource && (
            <div className="flex flex-row w-full  items-center  gap-6 justify-between ">
              <button
                className="bg-green-500 p-1 rounded-full"
                onClick={() => handleLike()}
              >
                <ThumbsUp />
              </button>
              <button
                className="bg-red-500 p-1 rounded-full"
                onClick={() => handleDislike()}
              >
                <ThumbsDown />
              </button>
              <button className="bg-white text-black p-3 rounded-full" onClick={()=>DeleteResource(userresource.id)}><MdDelete/></button>
            </div>
          )}
          {resource && (
            <div className="flex flex-col gap-2 w-full">
              <div className="flex flex-row w-full  items-center  gap-6 justify-between ">
                <span className=" flex flex-row items-center gap-2">
                  <span className="p-1 bg-green-500 rounded-full">
                    <ThumbsUp />
                  </span>
                  : {resource.dislikes?.length || "0"}
                </span>
                <span className=" flex flex-row items-center gap-2">
                  <span className="bg-red-500 p-1 rounded-full">
                    <ThumbsDown />
                  </span>
                  : {resource.likes?.length || "0"}
                </span>
                <ResourceSetting resource={resource} />
              </div>
             
            </div>
          )}
        </span>
      )}
      {(sheet || usersheet) && (
        <span className="flex flex-col items-center p-3 gap-2 bg-white/10 rounded  justify-center w-full">
          <Link
            href={`/sheet/${sheet?.id || usersheet?.id}`}
            className="text-lg"
          >
            {sheet?.title || usersheet?.title}
          </Link>
          <span className="flex flex-row  items-center justify-around w-full text-xs">
            <div className="flex flex-row items-center gap-2 text-base">
              <span>
                {sheet?.isPublic || usersheet?.isPublic ? (
                  <MdPublic />
                ) : (
                  <RiGitRepositoryPrivateFill />
                )}
              </span>
              <span>
                {sheet?.isPublic || usersheet?.isPublic ? "Public" : "Private"}
              </span>
            </div>
            <div className="flex flex-col gap-0 5">
              <span className="flex flex-row items-center gap-1">
                <span>Created:</span>
                {dateString(
                  new Date(sheet?.createdAt || usersheet?.createdAt || "")
                )}
              </span>
              <span className="flex flex-row items-center gap-1">
                <span>Updated:</span>
                {dateString(
                  new Date(sheet?.updatedAt || usersheet?.updatedAt || "")
                )}
              </span>
            </div>
          </span>
          {usersheet && (
            <div className="flex flex-row w-full  items-center  gap-6 ">
              <button
                className="bg-green-500 p-1 rounded-full"
                onClick={() => handleLike()}
              >
                <ThumbsUp />
              </button>
              <button
                className="bg-red-500 p-1 rounded-full"
                onClick={() => handleDislike()}
              >
                <ThumbsDown />
              </button>
              <button
                className="bg-black text-white p-3 rounded-full"
                onClick={() => DeleteSheet(usersheet.id)}
              >
                <MdDelete size={20} />
              </button>
            </div>
          )}
          {sheet && (
            <div className="flex flex-row items-center  justify-around w-full">
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
              <SettingButton sheet={sheet!} />
            </div>
          )}
        </span>
      )}
    </>
  );
};

export default MobileSheetSideBarItem;
