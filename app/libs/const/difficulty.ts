import { Difficulty } from "@prisma/client";
interface DifficultyOption {
    label: string;
    value: Difficulty;
}
export const difficulties:DifficultyOption[] = [
    { label: ' Recruit', value: 'Recruit' },
   
    { label: 'Elite', value: 'Elite' },
    { label: 'Veteran', value: 'Veteran' },
    { label: 'Legendary', value: 'Legendary' }
];
