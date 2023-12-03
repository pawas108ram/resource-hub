import { SolutionType } from "@prisma/client";

interface SolutionTypeProps{
    label: string;
    value: SolutionType;
}
export const solutionTypes:SolutionTypeProps[] = [
    { value: 'BruteForce', label: 'Brute Force' },
    { value: 'Optimal', label: 'Optimal' },
    {value:'Optimum',label:'Optimum'}
]