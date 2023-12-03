import { Complexity } from "@prisma/client";
interface ComplexityOption {
    label: string;
    value: Complexity;
}
export const complexities:ComplexityOption[] = [
    { label: 'Constant', value: 'Constant' },
    { label: 'Linear', value: 'Linear' },
    { label: 'Logarithmic', value: 'Logarithmic' },
    { label: 'Quadratic', value: 'Quadratic' },
    { label: 'Cubic', value: 'Cubic' },
    { label: 'Exponential', value: 'Exponential' },
    { label: 'Factorial', value: 'Factorial' },
    {label:'Other', value:'Other'}
];
