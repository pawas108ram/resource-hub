'use client'
import React, { useEffect, useState } from 'react';
import Heading from '../Heading';

import SheetSideBarItem from './SheetSideBarItem';


import { MdSearch } from 'react-icons/md';
import { FullSheetType } from '@/app/(dashboard-layout)/resource/layout';
import { pusherClient } from '@/app/libs/pusher';

interface SheetSideBarProps {
    ownSheets: FullSheetType[];
    userSheets: FullSheetType[];
    
}



const SheetSideBar: React.FC<SheetSideBarProps> = ({ ownSheets, userSheets }) => {
    const [searchTitle, setSearchTitle] = useState('');
    const [filterOwnSheets, setFilterOwnSheets] = useState<FullSheetType[]>(ownSheets);
    const [filterUserSheets, setFilterUserSheets] = useState<FullSheetType[]>(userSheets);
    
    useEffect(() => {
        if(searchTitle.length === 0){
            setFilterOwnSheets(ownSheets);
            setFilterUserSheets(userSheets);
        }
        else {
            setFilterOwnSheets(ownSheets.filter((sheet) => sheet?.title?.toLowerCase().includes(searchTitle.toLowerCase())));
            setFilterUserSheets(userSheets.filter((sheet) => sheet?.title?.toLowerCase().includes(searchTitle.toLowerCase())));
        }

    }, [ownSheets, userSheets, searchTitle]);
    useEffect(() => {
        pusherClient.subscribe('sheet');
        pusherClient.bind('update:sheet', (data: FullSheetType) => {
            setFilterOwnSheets((prev) => prev.map((sheet) => sheet.id === data.id ? data : sheet));
            setFilterUserSheets((prev) => prev.map((sheet) => sheet.id === data.id ? data : sheet));
        })
        return () => {
            pusherClient.unsubscribe('sheet');
            pusherClient.unbind('update:sheet');
        }
    },[])

   

   
    return (
        <>
            
            <div className='bg-black w-80 lg:flex flex-col gap-8  sticky top-0 h-screen  overflow-y-auto p-4 xs:hidden z-20  '>
                <Heading body='Search' className='text-gray-100 whitespace-nowrap' />
                <div className="flex flex-row gap-2 items-center py-2 ">
                    <input type="text" name="search" id="search" className='bg-gray-50 p-2 rounded w-full' placeholder='Search Sheets' onChange={(e) => setSearchTitle(e.target.value)} />
                   
                </div>

                
                <Heading body='My Sheets' className='text-gray-100 whitespace-nowrap' />
                {filterOwnSheets.length !== 0? (
                    <div className='bg-gray-50 p-4 rounded flex flex-col gap-2'>
                        { filterOwnSheets.map((sheet) => (
                            <SheetSideBarItem key={sheet.id} sheet={sheet} />
                        ))}
                    </div>
                ):<span className='text-xl bg-black p-3 rounded text-white'>No Own Sheets made yet </span>}
                <Heading body='User Sheets' className='text-gray-100 whitespace-nowrap' />
                {filterUserSheets.length !== 0 ? (
                    <div className='bg-gray-50 p-4 rounded flex flex-col gap-2'>
                        {  filterUserSheets.map((sheet) => (
                            <SheetSideBarItem key={sheet.id} userSheet={sheet} />
                        ))}
                    </div>
                ):<span className='bg-black p-3 rounded text-white text-xl'>No User Sheets Contracts Made Yet</span>}
            </div>
        </>
    );
};

export default SheetSideBar;
