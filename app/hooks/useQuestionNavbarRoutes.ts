
import { usePathname } from "next/navigation"
import { useMemo } from "react";

import { AiFillQuestionCircle, AiOutlineSolution } from "react-icons/ai";
import { BiSolidComment } from "react-icons/bi";
import { IconType } from 'react-icons';

interface QuestionNavbarRoute{
    label:string;
    href:string;
    icon:IconType;
    isActive:boolean;
}

const useQuestionNavbarRoutes = (questionId: number,sheetId:string) => {
    const pathName = usePathname();
    const routes = useMemo(() => [
        {
            label: 'Question',
            href: `/question/${sheetId}/${questionId}`,
            icon: AiFillQuestionCircle,
            isActive: pathName === `/question/${sheetId}/${questionId}`
        },
        {
            label: 'Solutions',
            href: `/question/${sheetId}/${questionId}/solutions`,
            icon: AiOutlineSolution,
            isActive: pathName === `/question/${sheetId}/${questionId}/solutions`
        },
        {
            label: 'Discussion',
            href: `/question/${sheetId}/${questionId}/discussion`,
            icon: BiSolidComment,
            isActive: pathName === `/question/${sheetId}/${questionId}/discussion`
        }
    ], [pathName, questionId,sheetId]);

    return routes as QuestionNavbarRoute[];
};

export default useQuestionNavbarRoutes;

