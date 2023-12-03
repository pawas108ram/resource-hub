import Heading from "@/components/Heading";
import SubHeading from "@/components/SubHeading";
import React from "react";


import SheetResourceCard from "./components/SheetCard";



import { getUserSheets } from "@/app/_actions/getUserSheets";
import { getUserResources } from "@/app/_actions/getUserResources";
import { getOwnSheets } from "@/app/_actions/getOwnSheets";
import { getOwnResources } from "@/app/_actions/getOwnResources";

const DashBoardPage = async () => {
  const ownSheets = await getOwnSheets();
  const ownResources = await getOwnResources();
  
  const userSheets = await getUserSheets();
  const userResources = await getUserResources();
  console.log(process.env.PUSHER_APP_ID,process.env.PUSHER_APP_KEY,process.env.PUSHER_APP_SECRET)


  return (
    <div className="flex flex-col gap-6 p-4 w-full xs:pb-32 lg:pb-0 relative h-screen overflow-hidden bg-black  ">
      <Heading body="Dashboard" className="underline text-white " />
      <div className="w-full flex lg:flex-row gap-8 xs:flex-col h-full lg:overflow-hidden xs:overflow-y-scroll">

        <div className="w-full grid lg:grid-cols-2 gap-4 xs:w-full h-full xs:grid-cols-1 ">
          <div className="flex flex-col gap-4 h-full lg:overflow-hidden xs:overflow-visible col-span-1">
            <SubHeading
              body="Personal Sheets/Resources"
              className="text-white "
            />
            <div className="h-full lg:overflow-y-auto xs:overflow-visible w-full ">
              {ownSheets.length !== 0 || ownResources.length !== 0 ? (
                <SheetResourceCard
                  sheetData={ownSheets}
                  resourceData={ownResources}
                />
              ) : (
                <span className="bg-white/10 p-4 w-full rounded text-white text-2xl text-center inline-flex">
                  No Sheets/Resources Made Yet
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-4 h-full lg:overflow-hidden xs:overflow-visible col-span-1   ">
            <SubHeading
              body="External Sheets/Resources"
              className="text-white "
            />
            <div className="h-full lg:overflow-y-auto xs:overflow-visible w-full">
              {userSheets.length !== 0 || userResources.length !== 0 ? (
                <SheetResourceCard
                  sheetData={userSheets}
                  resourceData={userResources}
                />
              ) : (
                <span className="bg-white/10 p-4 w-full rounded text-white text-2xl text-center inline-flex ">
                  No Sheets/Resources Contracts Made Yet
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoardPage;
