import { Complexity } from "@prisma/client";

export function ComplexityToO(complexity: Complexity){
    const complexityToLowerCase = complexity.toLowerCase();
    switch (complexityToLowerCase) {
        case 'constant':
      return 'O(1)';
    case 'logarithmic':
      return 'O(log n)';
    case 'linear':
      return 'O(n)';
    case 'quadratic':
      return 'O(n^2)';
    case 'cubic':
      return 'O(n^3)';
    case 'exponential':
      return 'O(2^n)';
    case 'factorial':
      return 'O(n!)';
    default:
      return 'Unknown complexity';
    }
   }