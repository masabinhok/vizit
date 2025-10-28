'use client';
import React, { useEffect, useMemo, useState } from 'react';
import type { AlgorithmStep, ArrayElement } from '../types';

type Props = {
  currentStep?: AlgorithmStep | null;
  steps?: AlgorithmStep[];
  isInitialized?: boolean;
};

export default function SieveVisualization({ currentStep }: Props) {
  const array: ArrayElement[] = (currentStep && currentStep.array) || [];

  const [dialogText, setDialogText] = useState<string>('');
  const [dialogVisible, setDialogVisible] = useState(false);
  const desc = useMemo(() => (currentStep && (currentStep.description ?? '')), [currentStep]);

  useEffect(() => {
    if (!desc) {
      setDialogVisible(false);
      setDialogText('');
      return;
    }
    setDialogText(desc);
    setDialogVisible(true);
    const t = setTimeout(() => setDialogVisible(false), 4200);
    return () => clearTimeout(t);
  }, [desc]);

  // vivid color tokens
  const defaultBlueSolid = '#3B82F6';
  const defaultBlueBg = 'rgba(59,130,246,0.12)';
  const primeGreenSolid = '#22C55E';
  const primeGreenBg = 'rgba(34,197,94,0.16)';
  const compositeRedSolid = '#F43F5E';
  const compositeRedBg = 'rgba(244,63,94,0.14)';
  const currentBorder = '3px solid rgba(250,204,21,0.98)';
  const actionBorder = '3px solid rgba(37,99,235,0.95)';

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '300px',
        paddingBottom: '100px'
      }}
    >
      {/* floating dialog that moves with scroll */}
      <div
        className="sieve-dialog"
        aria-hidden={!dialogVisible}
        style={{
          position: 'absolute',
          right: 16,
          bottom: 16,
          zIndex: 5,
          display: dialogVisible ? 'flex' : 'none',
          flexDirection: 'column',
          gap: 8,
          alignItems: 'flex-start',
          padding: '12px 16px',
          borderRadius: 10,
          boxShadow: '0 12px 36px rgba(2,6,23,0.30)',
          background: 'linear-gradient(180deg,#0284C7,#0EA5E9)',
          color: '#ffffff',
          fontSize: 14,
          maxWidth: '30rem',
          opacity: dialogVisible ? 1 : 0,
          transform: dialogVisible ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 250ms ease, transform 250ms ease'
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 14 }}>
          Step info
          {currentStep && typeof currentStep.codeLineIndex === 'number' ? ` · line ${currentStep.codeLineIndex}` : ''}
        </div>
        <div style={{ fontSize: 13, lineHeight: 1.25 }}>{dialogText}</div>
        <div style={{ fontSize: 12, opacity: 0.9 }}>
          {typeof currentStep?.comparisons === 'number' ? `Comparisons: ${currentStep?.comparisons}` : null}
          {typeof currentStep?.swaps === 'number' ? ` · Swaps: ${currentStep?.swaps}` : null}
        </div>
      </div>

      {/* grid of blocks */}
      <div
        className="sieve-viz-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(52px, 1fr))',
          gap: 10,
          alignItems: 'center',
          justifyItems: 'center',
          width: '100%',
          paddingTop: 8,
          paddingBottom: 8
        }}
        role="list"
      >
        {array.map((el, idx) => {
          const key = `${el.value}-${idx}`; // stable-enough key
          const value = el.value ?? '';
          const isCurrent = !!el.isComparing;
          const isAction = !!el.isSwapping;
          const isFinal = !!el.isSorted;
          const isPrime = !!el.isPrime;

          const background = isFinal ? (isPrime ? primeGreenBg : compositeRedBg) : defaultBlueBg;
          const borderColor = isFinal ? (isPrime ? primeGreenSolid : compositeRedSolid) : defaultBlueSolid;

          const style: React.CSSProperties = {
            width: '52px',
            height: '52px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
            transition: 'transform 140ms cubic-bezier(.2,.9,.2,1), box-shadow 140ms ease, background-color 140ms ease, border-color 140ms ease',
            userSelect: 'none',
            cursor: 'default',
            background,
            border: isCurrent ? currentBorder : isAction ? actionBorder : `2px solid ${borderColor}`,
            boxShadow: isCurrent ? '0 16px 36px rgba(250,204,21,0.14)' : isAction ? '0 10px 28px rgba(37,99,235,0.10)' : 'none',
            transform: isCurrent ? 'translateY(-4px)' : isAction ? 'scale(1.035)' : 'none',
            fontWeight: 800,
            color: '#0f172a'
          };

          const ariaLabel = `Number ${value}${isPrime ? ' — prime' : isFinal ? ' — composite' : ''}`;

          return (
            <div key={key} role="listitem" aria-label={ariaLabel} title={ariaLabel} style={style}>
              <span
                style={{
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
                  fontSize: 13
                }}
              >
                {String(value)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
