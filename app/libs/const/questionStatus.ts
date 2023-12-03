import { QuestionStatus } from "@prisma/client";


interface questionStatusProps{
    label: string;
    value: QuestionStatus;
    color: string;
}

export const questionStatus:questionStatusProps[] = [
    {label:'Solved',value:'SOLVED',color:'green'},
    {label:'Revised',value:'REVISED',color:'orange'},
    { label: 'Unsolved', value: 'UNATTEMPTED', color: 'red' },
    {label:'Skipped',value:'SKIPPED',color:'blue'}
]