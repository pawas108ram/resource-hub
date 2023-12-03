'use client'
import React, { useEffect, useState } from "react";
import { Resource, Sheet } from "@prisma/client";


import SheetCardItem from "./SheetCardItem";
import ResourceCardItem from "./ResourceCardItem";
import { FullSheetType } from "../../resource/layout";
import { pusherClient } from "@/app/libs/pusher";
import SubHeading from "@/components/SubHeading";

interface SheetResourceCardProps {
  sheetData?: Sheet[];
  resourceData?: Resource[];
}
const SheetResourceCard: React.FC<SheetResourceCardProps> = ({
  sheetData,
  resourceData,
}) => {
  const [sheets, setSheets] = useState<Sheet[]>(sheetData || []);
  const [resources, setResources] = useState<Resource[]>(resourceData || []);
  useEffect(() => {
    pusherClient.subscribe('sheet');
    pusherClient.bind('create:sheet', (data:FullSheetType) => {
      setSheets((prev) => [...prev,data]);
    });
    pusherClient.bind('delete:sheet', (data: number) => {
      setSheets((prev) => prev.filter((sheet) => sheet.id !== data));
    });
    return () => {
      pusherClient.unsubscribe('sheet');
      pusherClient.unbind('create:sheet');
      pusherClient.unbind('delete:sheet');
    }
    
  }, [])
  useEffect(() => {
    pusherClient.subscribe('resource');
    pusherClient.bind('create:resource', (data:Resource) => {
      setResources((prev) => [...prev,data]);
    });
    pusherClient.bind('delete:resource', (data: number) => {
      setResources((prev) => prev.filter((resource) => resource.id !== data));
    });
    return () => {
      pusherClient.unsubscribe('resource');
      pusherClient.unbind('create:resource');
      pusherClient.unbind('delete:resource');
    }
    
  }, [])
  

  

  return (
    <div className="bg-white/20 p-4 rounded shadow flex flex-col gap-4">
      <SubHeading body="Sheets" className="text-white font-bold" />
      {sheets != undefined && sheets.length !== 0 ? (
        sheets.map((sheet) => (
          <SheetCardItem
            key={sheet.id}
            createdAt={sheet.createdAt}
            updatedAt={sheet.updatedAt}
            title={sheet.title!}
            id={sheet.id}
            
            
          />
        ))
      ) : (
        <span className="bg-white/10 w-full rounded text-white text-center text-xl p-4 ">
          No Sheets Yet
        </span>
      )}
      <SubHeading body="Resources" className="text-white  font-bold" />
      {resources != undefined && resources.length !== 0 ? (
        resources.map((resource) => (
          <ResourceCardItem
            key={resource.id}
            title={resource.title!}
            createdAt={resource.createdAt}
            updatedAt={resource.updatedAt}
            id={resource.id}
            
            
          />
        ))
      ) : (
        <span className="bg-white/10 text-white p-4 rounded w-full text-xl text-center">
          No Resources Yet
        </span>
      )}
    </div>
  );
};

export default SheetResourceCard;
