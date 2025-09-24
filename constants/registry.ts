import { AlgorithmConfig } from '../types';
import { bubbleSortConfig } from '../app/algorithms/bubble-sort';

export const ALGORITHM_REGISTRY: Record<string, AlgorithmConfig> = {
  'bubble-sort': bubbleSortConfig,
  // Future algorithms will be added here
};

export const getAlgorithmConfig = (id: string): AlgorithmConfig | undefined => {
  return ALGORITHM_REGISTRY[id];
};

export const getAllAlgorithms = (): AlgorithmConfig[] => {
  return Object.values(ALGORITHM_REGISTRY);
};