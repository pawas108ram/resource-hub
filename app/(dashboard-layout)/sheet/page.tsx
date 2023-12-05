"use client";
import ControlBar from "@/components/SideBar/ControlBar";

import React, { useState, useEffect, use} from "react";
import {useViewport} from 'react-viewport-hooks'

import axios from "axios";
import Heading from "@/components/Heading";
import Sheets from "./components/Sheets";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { User } from "@prisma/client";

import { FullSheetType } from "../resource/layout";
import { useSearchParams } from "next/navigation";
import { pusherClient } from "@/app/libs/pusher";
import { baseUrlGiver } from "@/app/_actions/getQuestionById";









const SheetPage = () => {
  const [Sheet, setSheets] = useState<FullSheetType[]>([]);
  const [publicSheets, setPublicSheets] = useState<FullSheetType[]>([]);
  const [privateSheets, setPrivateSheets] = useState<FullSheetType[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const session = useSession();
  const email = session.data?.user?.email;
  const [searchTitle, setSearchTitle] = useState('');
  const searchParams = useSearchParams();
  const searchParamsString= searchParams?.toString();
  
  
  const { vw } = useViewport();
 
  



  useEffect(() => {
    const fetchData = async () => {
      const baseUrl = baseUrlGiver();
      const res = await axios.get(`${baseUrl}/api/sheets/?${encodeURI(searchParamsString || '')}`);

      setSheets(res.data);
      setPublicSheets(res.data.filter((sheet: FullSheetType) => sheet.isPublic));
      setPrivateSheets(res.data.filter((sheet: FullSheetType) => !sheet.isPublic));
    };

    fetchData();

    return () => {
      // Cleanup logic if needed
    };
  }, [searchParams,searchParamsString]);

  // Fetch current user on email change
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await fetch(`/api/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      if (user.ok) {
        const data = await user.json();
        setCurrentUser(data);
      }
    };
    
    if (email) {
      fetchCurrentUser();
    }

    return () => {
      // Cleanup logic if needed

    };
  }, [email]);

  useEffect(() => {
    pusherClient.subscribe('sheet');
    pusherClient.bind('remove:sheet', (data: number) => {
      setSheets((prev) => prev.filter((sheet) => sheet.id !== data));
      setPublicSheets((prev) => prev.filter((sheet) => sheet.id !== data));
      setPrivateSheets((prev) => prev.filter((sheet) => sheet.id !== data));
    

      
    });
    return () => {
      pusherClient.unsubscribe('sheet');
      pusherClient.unbind('remove:sheet');
    }
  }, [searchParamsString])
  // Filter sheets based on search title
  useEffect(() => {
    if (searchTitle!=='') {
      setPublicSheets((prevSheets) => prevSheets.filter((sheet: FullSheetType) => sheet?.title?.toLowerCase().includes(searchTitle.toLowerCase())));
      setPrivateSheets((prevSheets) => prevSheets.filter((sheet: FullSheetType) => sheet?.title?.toLowerCase().includes(searchTitle.toLowerCase())));
    } else {
      setPublicSheets(Sheet.filter((sheet: FullSheetType) => sheet.isPublic));
      setPrivateSheets(Sheet.filter((sheet: FullSheetType) => !sheet.isPublic));
    }
  }, [searchTitle,Sheet]);
 


  return (
    <div className="flex flex-col w-full gap-4  xs:py-24 lg:py-32   xs:items-center lg:items-start bg-black min-h-screen text-white  ">
      <div className="w-full   fixed xs:top-16 z-20 lg:top-0   ">
        <ControlBar title={searchTitle} setTitle={setSearchTitle} />
      </div>
      <div className="flex flex-row items-center ">
        <Heading body="Public Sheets"  />
        {publicSheets.length-(vw/150)>0  && <Link href={`/sheets/public`} className=' p-3 px-8 bg-black text-white  rounded ml-4' >Show all</Link>}
      </div>

      {publicSheets.length !== 0 ? <div className="p-4 bg-white/10 rounded w-full grid xl:grid-cols-3  lg:gap-x-4  lg:gap-y-4 xs:grid-cols-2 xs:gap-x-2 xs:gap-y-2 lg:grid-cols-3  ">
        {currentUser && publicSheets?.slice(0, (vw / 150)).map((sheet: FullSheetType) => {
          return <Sheets key={sheet.id} data={sheet} currentUserId={currentUser.id} />;
        })}
        
      </div>:<span className='text-xl text-black p-3 rounded bg-white/60 text-center w-5/6 self-center font-semibold '>No Public Sheets made yet </span>}
        
          
   
        
                    
       
        
     
      <div className="flex flex-row items-center">
        <Heading body="Private Sheets" />
        {publicSheets.length-(vw/150)>0  && <Link href={`/sheets/private`} className=' p-3 px-8 bg-black text-white  rounded ml-4' >Show all</Link>}
      </div>
      
      {privateSheets.length !== 0 ? <div className="p-4 bg-white/10 rounded w-full grid xl:grid-cols-3  lg:gap-x-4  lg:gap-y-4 xs:grid-cols-2 xs:gap-x-2 xs:gap-y-2 lg:grid-cols-3  ">
        {currentUser && privateSheets?.slice(0, (vw / 150)).map((sheet: FullSheetType) => {
          return <Sheets key={sheet.id} data={sheet} currentUserId={currentUser.id} currentUserKeys={currentUser.keys} />;
        })}
      </div>:<span className='text-xl text-black p-3 rounded bg-white/60 text-center w-5/6 self-center font-semibold '>No Private Sheets made yet </span>}
     
    </div>
  );
};

export default SheetPage;
