export interface ArrayElement {
  value: number;
  isComparing: boolean;
  isSwapping: boolean;
  isSorted: boolean;
  isSelected?: boolean;
  isPivot?: boolean;
  isPrime?: boolean;
  isFound?: boolean;
  color?: string;
}

export interface AlgorithmStep {
  array: ArrayElement[];
  description: string;
  codeLineIndex: number;
  additionalInfo?: Record<string, unknown>;

  // --- Made optional for Selection Sort ---
  i?: number;
  j?: number;
  comparisons?: number;
  swaps?: number;

  // --- Added for Radix Sort ---
  buckets?: ArrayElement[][];
  passCompleted?: number;
  totalPasses?: number;

  // --- Added for Counting Sort ---
  countArray?: number[];
  outputArray?: ArrayElement[];
  currentIndex?: number;
  currentValue?: number;
  phase?: 'init' | 'counting' | 'cumulative' | 'placing' | 'complete';
  highlightCountIndex?: number;
  originalIndices?: number[];
}

export interface AlgorithmConfig {
  id: string;
  name: string;
  category: string;
  description: string;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  code: string[];
  defaultInput: string;
  generateSteps: (input: number[]) => AlgorithmStep[];
}

export interface Category {
  name: string;
  algorithms: string[];
}

export interface VisualizationState {
  isPlaying: boolean;
  speed: number;
  currentStep: number;
  steps: AlgorithmStep[];
  isInitialized: boolean;
}


