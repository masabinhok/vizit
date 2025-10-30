// src/components/LinearSearchVisualization.tsx
'use client';

import React, { useMemo } from 'react';
import type { AlgorithmStep, ArrayElement } from '../types';

type Props = {
  currentStep?: AlgorithmStep | null;
  steps?: AlgorithmStep[];
  isInitialized?: boolean;
};

export default function LinearSearchVisualization({ currentStep }: Props) {
  const array: ArrayElement[] = (currentStep && currentStep.array) || [];

  const desc = currentStep?.description ?? '';
  const codeLine = currentStep?.codeLineIndex ?? null;

  const numericValues = useMemo(
    () => array.map(a => (typeof a.value === 'number' ? a.value : Number(a.value) || 0)),
    [array]
  );
  const maxVal = Math.max(1, ...numericValues);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1100px', // ✅ Contain the visualization width
        margin: '0 auto', // ✅ Center it horizontally
        minHeight: 320,
        overflow: 'visible',
      }}
    >
      {/* Floating Dialog */}
      <div
        aria-hidden={!desc}
        style={{
          position: 'absolute',
          right: 20,
          bottom: 20,
          zIndex: 999,
          pointerEvents: 'none',
          padding: '10px 14px',
          borderRadius: 10,
          maxWidth: '32rem',
          boxShadow: '0 12px 36px rgba(2,6,23,0.28)',
          background: 'linear-gradient(180deg,#0369A1,#0EA5E9)',
          color: '#fff',
          transform: desc ? 'translateY(0)' : 'translateY(8px)',
          opacity: desc ? 1 : 0,
          transition: 'opacity 220ms ease, transform 220ms ease',
          fontSize: 14,
          lineHeight: 1.25,
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 6 }}>
          Step info{codeLine !== null ? ` · line ${codeLine}` : ''}
        </div>
        <div style={{ fontSize: 13, opacity: 0.98 }}>{desc}</div>
        {typeof currentStep?.comparisons === 'number' && (
          <div style={{ marginTop: 8, fontSize: 12, opacity: 0.95 }}>
            Comparisons: {currentStep!.comparisons}
            {typeof currentStep!.swaps === 'number' ? ` · Swaps: ${currentStep!.swaps}` : ''}
          </div>
        )}
      </div>

      {/* Visualization Grid */}
      <div
        style={{
          width: '100%',
          overflowX: 'auto',
          padding: '16px 0',
          display: 'flex',
          justifyContent: 'center', // ✅ Centers the grid
        }}
      >
        <div
          role="list"
          aria-live="polite"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${array.length}, 1fr)`, // ✅ One column per item
            gap: 12,
            maxWidth: 'min(95%, 900px)', // ✅ Limits width to stop over-expansion
            alignItems: 'end',
            justifyItems: 'center',
          }}
        >
          {array.map((el, idx) => {
            const key = (el as any).id ?? `${el.value}-${idx}`;
            const value = el.value ?? '';

            const isCurrent = !!el.isComparing;
            const isChecked = !!el.isSorted;
            const isFound = !!el.isFound;
            const colorFlag = (el as any).color as string | undefined;

            const defaultBg = 'rgba(96,165,250,0.12)';
            const defaultBorder = '#60A5FA';

            let background = defaultBg;
            let border = `2px solid ${defaultBorder}`;
            let boxShadow = 'none';
            let transform = 'none';
            let textColor = '#021124';

            if (colorFlag) {
              background = colorFlag;
              border = `2px solid ${colorFlag}`;
            } else if (isFound) {
              background = 'rgba(16,185,129,0.16)';
              border = '3px solid #10B981';
              boxShadow = '0 10px 26px rgba(16,185,129,0.18)';
              transform = 'scale(1.04)';
              textColor = '#052e21';
            } else if (isCurrent) {
              background = 'rgba(250,204,21,0.08)';
              border = '3px solid rgba(250,204,21,0.98)';
              boxShadow = '0 12px 36px rgba(250,204,21,0.10)';
              transform = 'translateY(-6px)';
            } else if (isChecked) {
              background = 'rgba(239,68,68,0.12)';
              border = '2px solid #EF4444';
              boxShadow = '0 8px 22px rgba(239,68,68,0.06)';
            }

            const style: React.CSSProperties = {
              width: 56,
              height: 56,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
              transition:
                'transform 160ms ease, box-shadow 160ms ease, background-color 140ms ease, border-color 140ms ease',
              userSelect: 'none',
              background,
              border,
              boxShadow,
              transform,
              fontWeight: 800,
              color: textColor,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
              fontSize: 14,
            };

            const ariaLabel = `Number ${value}${isFound ? ' — found' : isCurrent ? ' — current' : isChecked ? ' — checked' : ''}`;

            return (
              <div key={key} role="listitem" aria-label={ariaLabel} title={ariaLabel} tabIndex={0} style={style}>
                {String(value)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
