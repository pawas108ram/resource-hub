'use client'
import React, { useEffect, useState } from 'react'
import SheetSideBar from '@/components/SideBar/SheetSIdeBar'

import MobileSheetSideBar from '@/components/SideBar/MobileSheetSideBar';
import { FullResourceType, FullSheetType } from '../resource/layout';
import { pusherClient } from '@/app/libs/pusher';
import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { getOwnSheets } from '@/app/_actions/getOwnSheets';


const SheetLayout = ({ children }: { children: React.ReactNode }) => {
  const [ownSheets, setOwnSheets] = useState<FullSheetType[]>([]);
  const [ownResources, setOwnResources] = useState<FullResourceType[]>([]);
  const [userResources, setUserResources] = useState<FullResourceType[]>([]);
    const [userSheets, setUserSheets] = useState<FullSheetType[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const session = useSession();
    const email = session.data?.user?.email;

  useEffect(() => {
      const fetchData = async () => {
          try {
                const ownsheets = await fetch('/api/sheets/ownSheets')
              const ownresources = await fetch('/api/resources/ownResources')
              const userSheets = await fetch('/api/sheets/userSheets')
              const userResources = await fetch('/api/resources/userResources')
                const user = await fetch('/api/user', {
                  method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                  },
                    body: JSON.stringify({ email }),
              }).then((res) => res.json());
              if (ownsheets.ok) {
                    setOwnSheets(await ownsheets.json());
                  
              }
              if(ownresources.ok){
                    setOwnResources(await ownresources.json());
              }
                if(userSheets.ok){
                        setUserSheets(await userSheets.json());
              }
              if(userResources.ok){
                        setUserResources(await userResources.json());
              }
          } catch (error) {
              console.error('Error fetching data:', error);
          }
      };
      

      if (email) {
            fetchData();
      }

     
  }, [email]);
    
    useEffect(() => {
        pusherClient.subscribe('sheet');
        if (currentUser) {
            pusherClient.bind('create:sheet', (data: FullSheetType) => {
                if (currentUser?.id === data.authorId) {
                    setOwnSheets((prev) => [...prev, data]);
                }
                else {
                    setUserSheets((prev) => [...prev, data]);
                }
            });
            pusherClient.bind('user:sheet', (data: FullSheetType) => {
                setUserSheets((prev) => {
                    const index = prev.findIndex((sheet) => sheet.id === data.id);
                    if (index === -1) {
                        return [...prev, data];
                    }
                    else {
                        return [...prev]
                    }
                })
            })
      
            pusherClient.bind('delete:sheet', (data: number) => {
                setOwnSheets((prev) => prev.filter((sheet) => sheet.id !== data));
                setUserSheets((prev) => prev.filter((sheet) => sheet.id !== data));
            });
        }
        return () => {
            pusherClient.unsubscribe('sheet');
            pusherClient.unbind('create:sheet');
            pusherClient.unbind('delete:sheet');
            pusherClient.unbind('user:sheet');
        }
      
    }, [currentUser, ownSheets, userSheets])
    
    useEffect(() => {

        pusherClient.subscribe('resource');
        if (currentUser) {
            pusherClient.bind('create:resource', (data: FullResourceType) => {
                if (currentUser?.id === data.authorId) {
                    setOwnResources((prev) => [...prev, data]);
                }
                else {
                    setUserResources((prev) => [...prev, data]);
                }
            });
            pusherClient.bind('delete:resource', (data: number) => {
                setOwnResources((prev) => prev.filter((resource) => resource.id !== data));
                setUserResources((prev) => prev.filter((resource) => resource.id !== data));
            });
        }
        return () => {
            pusherClient.unsubscribe('resource');
            pusherClient.unbind('create:resource');
            pusherClient.unbind('delete:resource');
        }
    }, [ownSheets, ownResources, currentUser])
   
  return (
    <div className='flex lg:flex-row w-full items-start h-full xs:flex-col  '>
      
        <MobileSheetSideBar ownSheets={ownSheets} ownResources={ownResources} userResources={userResources} userSheets={userSheets} />
          
          
           
              <SheetSideBar  ownSheets={ownSheets}  userSheets={userSheets} />
          
         
          {children }
          
    </div>
  )
}

export default SheetLayout
