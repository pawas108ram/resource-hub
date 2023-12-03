import { useParams, usePathname, useSearchParams } from "next/navigation"
import { useMemo } from "react";
import { AiTwotoneHome, AiFillPlusSquare } from 'react-icons/ai'
import { BsFileEarmarkSpreadsheetFill } from 'react-icons/bs'
import { GrResources } from 'react-icons/gr'
import {BiLogOut} from 'react-icons/bi'
import { signOut } from "next-auth/react";
import { MdLeaderboard } from "react-icons/md";
import { FaStore } from "react-icons/fa";


const useRoutes = () => {
    const pathname = usePathname();
    const params = useParams();
    const page = useMemo(() => {
       if(params?.page) {
           return parseInt(params.page as string);
       }
   },[params?.page]);
   
    
    
    const routes = useMemo(() => [
        {
            label: 'Dashboard',
            href:'/dashboard',
            icon: AiTwotoneHome,
            isActive: pathname === '/dashboard'
        },
        {
            label: 'Sheets',
            href:'/sheet',
            icon: BsFileEarmarkSpreadsheetFill,
            isActive:pathname === '/sheet'
        },
        {
            label: 'Resources',
            href:'/resource',
            icon: GrResources,
            isActive:pathname === '/resource'
        },
        {
            label: 'LeaderBoard',
            href: `/leaderboard?page=1`,
            icon: MdLeaderboard,
            isActive:pathname === `/leaderboard` || !!page
        },
        {
            label: 'Store',
            href: '/store',
            icon: FaStore,
            isActive:pathname === '/store'

        },

        {
            label: 'Logout',
            icon: BiLogOut,
            onClick: () => signOut(),
            href:'#',
        }
        
    ], [pathname,page])
    return routes;
}

export default useRoutes;