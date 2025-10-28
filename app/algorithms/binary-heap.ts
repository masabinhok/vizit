// app/algorithms/binary-heap.ts
export interface HeapStep {
  heap: number[];
  action: string;
  highlights: { [key: string]: number[] };
}

// Define HeapType
export type HeapType = 'max' | 'min';

// Rename class to be more general
export class BinaryHeap {
  heap: number[];
  heapType: HeapType; // Store the type

  // Accept heapType in constructor, default to 'max'
  constructor(type: HeapType = 'max') {
    this.heap = [];
    this.heapType = type;
    // Optional: console.log(`Heap initialized as ${type}-heap`);
  }

  // --- Comparison Helper ---
  private shouldSwap(childValue: number, parentValue: number): boolean {
    if (this.heapType === 'max') {
      return childValue > parentValue;
    } else {
      return childValue < parentValue;
    }
  }

  // --- Helper to find appropriate child for sift-down ---
  private findAppropriateChildIndex(currentIndex: number): number | null {
      const leftChildIndex = 2 * currentIndex + 1;
      const rightChildIndex = 2 * currentIndex + 2;
      let appropriateChildIndex: number | null = null;
      const hasLeftChild = leftChildIndex < this.heap.length;
      const hasRightChild = rightChildIndex < this.heap.length;

      if (hasLeftChild && hasRightChild) {
        const leftChild = this.heap[leftChildIndex];
        const rightChild = this.heap[rightChildIndex];
        appropriateChildIndex = (this.heapType === 'max' ? leftChild > rightChild : leftChild < rightChild) ? leftChildIndex : rightChildIndex;
      } else if (hasLeftChild) {
        appropriateChildIndex = leftChildIndex;
      }
      return appropriateChildIndex;
  }

  // --- Other Helper Methods ---
  private getParentIndex(i: number): number { return Math.floor((i - 1) / 2); }
  private swap(i1: number, i2: number): void { [this.heap[i1], this.heap[i2]] = [this.heap[i2], this.heap[i1]]; }

  // --- Generator: Insert Operation (Sift-Up) ---
  *insertStep(value: number): Generator<HeapStep> {
    this.heap.push(value);
    let currentIndex = this.heap.length - 1;
    const opVerb = this.heapType === 'max' ? 'larger' : 'smaller';
    const comparisonOp = this.heapType === 'max' ? '>' : '<';

    yield { heap: [...this.heap], action: `Adding ${value} to end (index ${currentIndex}).`, highlights: { active: [currentIndex] } };

    let parentIndex = this.getParentIndex(currentIndex);

    while (currentIndex > 0 && this.shouldSwap(this.heap[currentIndex], this.heap[parentIndex])) {
      yield { heap: [...this.heap], action: `Comparing child ${this.heap[currentIndex]} (idx ${currentIndex}) ${comparisonOp} parent ${this.heap[parentIndex]} (idx ${parentIndex}). Child is ${opVerb}.`, highlights: { compare: [currentIndex, parentIndex] } };
      yield { heap: [...this.heap], action: `Swapping child ${this.heap[currentIndex]} (idx ${currentIndex}) and parent ${this.heap[parentIndex]} (idx ${parentIndex}).`, highlights: { swap: [currentIndex, parentIndex] } };
      this.swap(currentIndex, parentIndex);
      yield { heap: [...this.heap], action: `Swap complete. Moving up to index ${parentIndex}.`, highlights: { active: [parentIndex] } };
      currentIndex = parentIndex;
      parentIndex = this.getParentIndex(currentIndex);
    }

     if (currentIndex === 0) { yield { heap: [...this.heap], action: `Value ${this.heap[currentIndex]} reached the root. Heap property maintained.`, highlights: { active: [currentIndex] } }; }
     else if (parentIndex >= 0 && !this.shouldSwap(this.heap[currentIndex], this.heap[parentIndex])) { yield { heap: [...this.heap], action: `Value ${this.heap[currentIndex]} (idx ${currentIndex}) is NOT ${opVerb} than parent ${this.heap[parentIndex]} (idx ${parentIndex}). Heap property maintained.`, highlights: { active: [currentIndex], compare: [currentIndex, parentIndex] } }; }
     else { yield { heap: [...this.heap], action: `Sift-up complete for ${value}. ${this.heapType === 'max' ? 'Max' : 'Min'} Heap is valid.`, highlights: { active: [currentIndex] } }; }
  }

  // --- Generator: Extract Root Operation (Sift-Down) ---
  *extractRootStep(): Generator<HeapStep> {
    const rootLabel = this.heapType === 'max' ? 'max' : 'min';
    const comparisonVerb = this.heapType === 'max' ? '>=' : '<=';
    const childDescription = this.heapType === 'max' ? 'largest' : 'smallest';
    const opVerb = this.heapType === 'max' ? 'smaller' : 'larger'; // Is parent smaller/larger than child? (Opposite of shouldSwap)


    if (this.heap.length === 0) { yield { heap: [], action: `Heap is empty. Cannot extract ${rootLabel}.`, highlights: {} }; return; }
    if (this.heap.length === 1) { const rootValue = this.heap.pop()!; yield { heap: [], action: `Extracted ${rootLabel} value ${rootValue}. Heap is now empty.`, highlights: {} }; return; }

    const rootValue = this.heap[0];
    const lastElement = this.heap[this.heap.length - 1];
    yield { heap: [...this.heap], action: `Preparing to extract ${rootLabel} value ${rootValue}. Swapping root with last element ${lastElement}.`, highlights: { swap: [0, this.heap.length - 1] } };
    this.swap(0, this.heap.length - 1);
    this.heap.pop();

    if (this.heap.length === 0) { yield { heap: [], action: `Extracted ${rootLabel} value ${rootValue}. Heap is now empty.`, highlights: {} }; return; }

    const newRoot = this.heap[0];
    yield { heap: [...this.heap], action: `Extracted ${rootValue}. Moved ${newRoot} to root. Sifting down.`, highlights: { active: [0] } };

    let currentIndex = 0;
    while (true) {
      const appropriateChildIndex = this.findAppropriateChildIndex(currentIndex);

      if (appropriateChildIndex === null) { yield { heap: [...this.heap], action: `Node ${this.heap[currentIndex]} (idx ${currentIndex}) has no children. Sift-down complete.`, highlights: { active: [currentIndex] } }; break; }

      yield { heap: [...this.heap], action: `Comparing parent ${this.heap[currentIndex]} (idx ${currentIndex}) with its ${childDescription} child ${this.heap[appropriateChildIndex]} (idx ${appropriateChildIndex}).`, highlights: { compare: [currentIndex, appropriateChildIndex] } };

      // Check heap property using shouldSwap (if child should swap -> property violated)
      if (!this.shouldSwap(this.heap[appropriateChildIndex], this.heap[currentIndex])) {
        yield { heap: [...this.heap], action: `Parent ${this.heap[currentIndex]} (idx ${currentIndex}) ${comparisonVerb} ${childDescription} child ${this.heap[appropriateChildIndex]} (idx ${appropriateChildIndex}). Heap property holds. Sift-down complete.`, highlights: { active: [currentIndex] } };
        break; // Heap property is satisfied
      }

      yield { heap: [...this.heap], action: `Parent ${this.heap[currentIndex]} is ${opVerb} than child ${this.heap[appropriateChildIndex]}. Swapping nodes ${currentIndex} and ${appropriateChildIndex}.`, highlights: { swap: [currentIndex, appropriateChildIndex] } };
      this.swap(currentIndex, appropriateChildIndex);
      yield { heap: [...this.heap], action: `Swap complete. Moving down to index ${appropriateChildIndex}.`, highlights: { active: [appropriateChildIndex] } };
      currentIndex = appropriateChildIndex;
    }
     yield { heap: [...this.heap], action: `${this.heapType === 'max' ? 'Max' : 'Min'} Heap is valid after sift-down.`, highlights: {} };
  }
}