import { usePathname } from "next/navigation"
import { useMemo } from "react";
import { AiTwotoneHome, AiOutlinePullRequest } from 'react-icons/ai'
import { BsFileEarmarkSpreadsheetFill } from 'react-icons/bs'
import { GrResources } from 'react-icons/gr'
import {BiLogOut} from 'react-icons/bi'
import { signOut } from "next-auth/react";


const useRoutes = () => {
    const pathname = usePathname();
    
    const routes = useMemo(() => [
        {
            label: 'Dashboard',
            href:'/dashboard',
            icon: AiTwotoneHome,
            isActive: pathname === '/dashboard'
        },
        {
            label: 'Sheets',
            href:'/sheets',
            icon: BsFileEarmarkSpreadsheetFill,
            isActive:pathname === '/sheets'
        },
        {
            label: 'Resources',
            href:'/resources',
            icon: GrResources,
            isActive:pathname === '/resources'
        },
        {
            label: 'Requests',
            href:'/requests',
            icon: AiOutlinePullRequest,
            isActive:pathname === '/requests'
        },
        {
            label: 'Logout',
            icon: BiLogOut,
            onClick: () => signOut(),
            href:'#',
        }
        
    ], [pathname])
    return routes;
}

export default useRoutes;