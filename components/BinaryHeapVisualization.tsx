'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useTheme } from '@/contexts/ThemeContext'; // Assuming theme context exists

// Props matching the 'HeapStep' interface from our logic file
interface BinaryHeapVisualizationProps {
  heap: number[];
  highlights: { [key: string]: number[] };
}

// Node position calculation logic (UPDATED FOR CENTERING)
interface NodePosition {
  value: number;
  index: number;
  x: number;
  y: number;
  level: number;
}

const calculateNodePositions = (heap: number[], width: number, nodeSize: number, levelHeight: number): NodePosition[] => {
    if (!heap || heap.length === 0 || width <= 0) return [];

    const positions: NodePosition[] = [];
    const nodeRadius = nodeSize / 2;
    // Adjust spacing between nodes for better layout, especially at wider levels
    const horizontalNodeSpacingFactor = 1.7; // Increase for more space (e.g., 1.5 -> 2.0)
    const horizontalNodeSpacing = nodeSize * horizontalNodeSpacingFactor;

    // Step 1: Determine the maximum width needed for any level and count nodes
    let maxWidthRequired = 0;
    const nodesPerLevel: { [key: number]: number } = {};
    const levelNodeIndices: { [key: number]: number[] } = {}; // Store actual indices per level

    heap.forEach((_, index) => {
        const level = Math.floor(Math.log2(index + 1));
        nodesPerLevel[level] = (nodesPerLevel[level] || 0) + 1;
        if (!levelNodeIndices[level]) {
          levelNodeIndices[level] = [];
        }
        levelNodeIndices[level].push(index); // Store the actual heap index for this node
    });

    Object.values(nodesPerLevel).forEach(count => {
        // Calculate width based on node size and spacing
        const levelWidth = count * nodeSize + (count > 1 ? (count - 1) * (horizontalNodeSpacing - nodeSize) : 0);
        maxWidthRequired = Math.max(maxWidthRequired, levelWidth);
    });

    // Determine the effective width to use for centering calculations
    // Ensure it's at least the required width, plus some padding
    const effectiveContainerWidth = Math.max(width, maxWidthRequired + nodeSize);


    // Step 2: Calculate positions using the effective width for centering
    heap.forEach((value, index) => {
        const level = Math.floor(Math.log2(index + 1));
        const actualNodesInThisLevel = nodesPerLevel[level];
        // Find the 0-based position of *this specific node* among the *actual* nodes at this level
        const positionWithinActualLevel = levelNodeIndices[level].indexOf(index);

        // Calculate total width occupied by actual nodes in this level
        const actualLevelContentWidth = actualNodesInThisLevel * nodeSize + (actualNodesInThisLevel > 1 ? (horizontalNodeSpacing - nodeSize) : 0);

        // Calculate starting X to center the block of actual nodes for this level
        const startX = (effectiveContainerWidth - actualLevelContentWidth) / 2;

        // Calculate individual node's X position based on its order within the actual nodes
        const x = startX + positionWithinActualLevel * horizontalNodeSpacing + nodeRadius;


        // Calculate vertical position
        const y = level * levelHeight + levelHeight / 2;

        positions.push({ value, index, x, y, level });
    });

    // Final check for single node centering (though less critical now)
    if (positions.length === 1) {
         positions[0].x = effectiveContainerWidth / 2;
    }

    return positions;
};


export const BinaryHeapVisualization: React.FC<BinaryHeapVisualizationProps> = ({
  heap,
  highlights,
}) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';
  const treeContainerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(600); // Default width

  // Constants for tree layout
  const nodeRadius = 24;
  const nodeSize = nodeRadius * 2;
  const levelHeight = 85; // Vertical space between levels

  // --- START OF INSERTED CODE (FIX FOR ReferenceError) ---
  // Helper to calculate line coordinates from parent edge to child edge
  const getLineCoords = (parent: NodePosition, child: NodePosition | undefined) => {
      if (!child) return null;
      // Note: nodeRadius is available via closure here

      // Calculate angle from parent to child
      const angle = Math.atan2(child.y - parent.y, child.x - parent.x);

      // Start point on parent circle edge
      const startX = parent.x + nodeRadius * Math.cos(angle);
      const startY = parent.y + nodeRadius * Math.sin(angle);

      // End point on child circle edge
      const endX = child.x - nodeRadius * Math.cos(angle);
      const endY = child.y - nodeRadius * Math.sin(angle);

      return { x1: startX, y1: startY, x2: endX, y2: endY };
  };
  // --- END OF INSERTED CODE ---


  // Calculate node positions based on the current heap state and container width
  const nodePositions = useMemo(() => {
     // Pass containerWidth minus some padding to the calculation
     const effectiveWidth = Math.max(200, containerWidth - 32); // Use state width minus padding (p-4 = 32px)
     return calculateNodePositions(heap, effectiveWidth, nodeSize, levelHeight);
  }, [heap, containerWidth, nodeSize, levelHeight]); // Recalculate when heap or width changes

  // Determine the maximum level for SVG height calculation
  const maxLevel = nodePositions.reduce((max, node) => Math.max(max, node.level), -1);
  // Calculate SVG height dynamically, ensuring enough space
  const svgHeight = Math.max(300, (maxLevel + 1.5) * levelHeight);


  // Effect to update container width on resize or initial load
  useEffect(() => {
    const updateWidth = () => {
      if (treeContainerRef.current) {
        // Get actual offsetWidth (includes padding, border, scrollbar)
         const availableWidth = treeContainerRef.current.clientWidth; // Use clientWidth (excludes border/scrollbar)
         setContainerWidth(Math.max(200, availableWidth)); // Ensure a minimum width
      }
    };
    // Debounce resize handler slightly for performance
    let resizeTimeout: NodeJS.Timeout;
    const debouncedUpdateWidth = () => {
         clearTimeout(resizeTimeout);
         resizeTimeout = setTimeout(updateWidth, 150);
    }

    updateWidth(); // Initial width check
    window.addEventListener('resize', debouncedUpdateWidth);
    return () => {
        clearTimeout(resizeTimeout); // Clear timeout on unmount
        window.removeEventListener('resize', debouncedUpdateWidth); // Cleanup listener
    };
  }, [nodeSize, levelHeight]); // Added constants to dependencies

  // Helper to get styling classes based on highlights for both array and tree nodes
  const getHighlightStyling = (index: number): { base: string; svgFill: string; svgStroke: string; text: string; scale: number; pulse: boolean } => {
    let baseStyle = `relative w-16 h-16 rounded-lg border-2 flex items-center justify-center text-base font-bold transition-all duration-300 flex-shrink-0 shadow-md hover:scale-102`;
    let svgFillClass = isDarkMode ? 'fill-slate-700' : 'fill-gray-200';
    let svgStrokeClass = isDarkMode ? 'stroke-slate-500' : 'stroke-gray-400';
    let textClass = isDarkMode ? 'fill-slate-200 text-slate-200' : 'fill-gray-700 text-gray-700'; // Add text color for array
    let scale = 1; // Default scale
    let pulse = false; // Default pulse (for swap animation)

    if (highlights.swap?.includes(index)) {
      baseStyle += isDarkMode ? ' bg-gradient-to-r from-red-600/90 to-pink-600/90 border-red-400/60 text-white shadow-red-500/30 scale-110' : ' bg-gradient-to-r from-red-500/90 to-pink-500/90 border-red-400/70 text-white shadow-red-500/40 scale-110';
      svgFillClass = isDarkMode ? 'fill-red-600' : 'fill-red-500';
      svgStrokeClass = isDarkMode ? 'stroke-red-400' : 'stroke-red-400';
      textClass = 'fill-white text-white';
      scale = 1.1; // Make it 10% larger
      pulse = true; // Enable pulse animation
    } else if (highlights.compare?.includes(index)) {
      baseStyle += isDarkMode ? ' bg-gradient-to-r from-blue-600/90 to-indigo-600/90 border-blue-400/60 text-white shadow-blue-500/30 ring-2 ring-blue-400/50 scale-105' : ' bg-gradient-to-r from-blue-500/90 to-indigo-500/90 border-blue-400/70 text-white shadow-blue-500/40 ring-2 ring-blue-400/50 scale-105';
      svgFillClass = isDarkMode ? 'fill-blue-600' : 'fill-blue-500';
      svgStrokeClass = isDarkMode ? 'stroke-blue-400' : 'stroke-blue-400';
      textClass = 'fill-white text-white';
      scale = 1.05; // Make it 5% larger
      pulse = false;
    } else if (highlights.active?.includes(index)) {
      baseStyle += isDarkMode ? ' bg-gradient-to-r from-green-600/90 to-emerald-600/90 border-green-400/60 text-white shadow-green-500/30 scale-105' : ' bg-gradient-to-r from-green-500/90 to-emerald-500/90 border-green-400/70 text-white shadow-green-500/40 scale-105';
      svgFillClass = isDarkMode ? 'fill-green-600' : 'fill-green-500';
      svgStrokeClass = isDarkMode ? 'stroke-green-400' : 'stroke-green-400';
      textClass = 'fill-white text-white';
      scale = 1.05; // Make it 5% larger
      pulse = false;
    } else {
      // Default style
      baseStyle += isDarkMode ? ' bg-gradient-to-r from-slate-700/90 to-slate-600/90 border-slate-500/60 text-slate-200 shadow-slate-500/20' : ' bg-gradient-to-r from-gray-200/90 to-gray-100/90 border-gray-400/70 text-gray-700 shadow-gray-400/30';
      // SVG Fill/Stroke/Text classes already assigned default values
    }
    return { base: baseStyle, svgFill: svgFillClass, svgStroke: svgStrokeClass, text: textClass, scale, pulse }; // RETURN scale and pulse
  };


  return (
    // Main container for visualization content
    <div className="flex-1 flex flex-col items-center justify-start min-h-0 relative p-4">

      {heap.length === 0 ? (
        // Empty State
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className={`w-24 h-24 rounded-2xl mb-4 flex items-center justify-center ${
            isDarkMode ? 'bg-slate-800/30 border border-slate-700/30' : 'bg-gray-100/50 border border-gray-200/30'
          } backdrop-blur-sm`}>
            <svg className={`w-12 h-12 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h18M3 7h18M3 11h18M3 15h18M3 19h18" />
            </svg>
          </div>
          <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
            Heap is Empty
          </h3>
          <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
            Insert elements to build the heap visualization
          </p>
        </div>
      ) : (
        // Visualization Area when heap is not empty
        <div className="flex flex-col items-center w-full">
          {/* 1. Array Representation */}
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Array Representation
          </h3>
          <div className="flex flex-wrap justify-center gap-3 mb-8 min-h-[80px]">
            {heap.map((value, index) => {
               const styles = getHighlightStyling(index);
               return (
                  <div
                    key={`array-${index}`}
                    className={`${styles.base} ${styles.pulse ? 'animate-pulse' : ''}`} // Add pulse class conditionally
                    style={{ transition: 'transform 0.3s ease, background 0.3s ease' }}
                  >
                    {/* Ensure text color class is applied */}
                    <span className={`relative z-10 ${styles.text.includes('text-white') ? 'text-white' : (isDarkMode ? 'text-slate-200' : 'text-gray-700')}`}>{value}</span>
                    <div className={`absolute -bottom-5 text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                      [{index}]
                    </div>
                  </div>
               );
               })}
          </div>

          {/* 2. Tree Visualization */}
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Tree Representation
          </h3>
          {/* Container div used for measuring width */}
          <div ref={treeContainerRef} className={`w-full h-[500px] max-h-[60vh] relative rounded-lg border p-4 overflow-auto ${isDarkMode ? 'border-slate-700 bg-slate-900/30' : 'border-gray-300 bg-gray-50/30'}`}>
            {/* SVG Canvas for Drawing - Use state variable for width */}
            <svg width={containerWidth} height={svgHeight} className="transition-all duration-300 ease-in-out block mx-auto"> {/* Center SVG if needed */}
              {/* Draw Lines (Edges) */}
              {/* Draw Lines (Edges) - USING HELPER FOR CLEAN CONNECTION */}
              {nodePositions.map((node, i) => {
                const leftChildIndex = 2 * i + 1;
                const rightChildIndex = 2 * i + 2;
                // Find positions using calculated array
                const leftChildPos = nodePositions.find(p => p.index === leftChildIndex);
                const rightChildPos = nodePositions.find(p => p.index === rightChildIndex);

                // Calculate line coordinates using the helper function
                const leftLineCoords = getLineCoords(node, leftChildPos);
                const rightLineCoords = getLineCoords(node, rightChildPos);

                return (
                  <React.Fragment key={`lines-${i}`}>
                    {leftLineCoords && (
                      <line
                        {...leftLineCoords} // Spread x1, y1, x2, x2 from the helper
                        className={`transition-all duration-300 ease-in-out ${isDarkMode ? 'stroke-slate-600' : 'stroke-gray-400'}`}
                        strokeWidth="1.5" // Thinner line for cleaner look
                      />
                    )}
                    {rightLineCoords && (
                      <line
                        {...rightLineCoords} // Spread x1, y1, x2, y2 from the helper
                        className={`transition-all duration-300 ease-in-out ${isDarkMode ? 'stroke-slate-600' : 'stroke-gray-400'}`}
                        strokeWidth="1.5" // Thinner line for cleaner look
                      />
                    )}
                  </React.Fragment>
                );
              })}

              {/* Draw Nodes (Circles and Text) */}
              {nodePositions.map((node) => {
                const styles = getHighlightStyling(node.index);
                return (
                  <g
                      key={`node-${node.index}`}
                      // Apply transform for position and scale
                      transform={`translate(${node.x}, ${node.y}) scale(${styles.scale})`}
                      // Apply transition to the group for smooth scaling/movement
                      className={`transition-transform duration-300 ease-in-out origin-center ${styles.pulse ? 'animate-pulse' : ''}`}
                  >
                    <circle
                      r={nodeRadius}
                      className={`${styles.svgFill} ${styles.svgStroke}`}
                      strokeWidth="2"
                    />
                    <text
                      // Extract only the fill class for SVG text
                      className={`${styles.text.split(' ')[0]} font-bold text-base select-none`}
                      textAnchor="middle" // Center text horizontally
                      dy=".3em" // Center text vertically
                    >
                      {node.value}
                    </text>
                    <text
                      className={`text-xs ${isDarkMode ? 'fill-slate-400' : 'fill-gray-500'} select-none`}
                      textAnchor="middle"
                      dy={nodeRadius + 14} // Position index slightly further below circle
                    >
                      [{node.index}]
                    </text>
                  </g>
                );
              })}
            </svg>
            {/* Message if heap becomes empty during operations */}
            {heap.length === 0 && nodePositions.length === 0 && (
               <p className="absolute inset-0 flex items-center justify-center text-center text-gray-400">
                 (Heap became empty)
               </p>
            )}
             {/* Fallback message if width calculation hasn't run */}
             {heap.length > 0 && containerWidth <= 200 && (
                <p className="absolute inset-0 flex items-center justify-center text-center text-gray-400">
                    Calculating layout...
                </p>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

// Make sure to export default if this is the primary export for the file
export default BinaryHeapVisualization;