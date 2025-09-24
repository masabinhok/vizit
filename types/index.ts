export interface ArrayElement {
  value: number;
  isComparing: boolean;
  isSwapping: boolean;
  isSorted: boolean;
  isSelected?: boolean;
  isPivot?: boolean;
}

export interface AlgorithmStep {
  array: ArrayElement[];
  i: number;
  j: number;
  description: string;
  codeLineIndex: number;
  comparisons: number;
  swaps: number;
  additionalInfo?: Record<string, any>;
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