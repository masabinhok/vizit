import React from 'react';

interface BucketVisualizationProps {
  buckets: number[][];
  isDarkMode: boolean;
}

const BucketVisualization: React.FC<BucketVisualizationProps> = ({ buckets, isDarkMode }) => {
  return (
    <div className="flex flex-col gap-2 p-4">
      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Digit Buckets
      </h3>
      <div className="grid grid-cols-5 gap-4">
        {buckets.map((bucket, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg ${
              isDarkMode
                ? 'bg-slate-800/50 border border-slate-700'
                : 'bg-white/50 border border-gray-200'
            }`}
          >
            <div className={`text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Bucket {i}
            </div>
            <div className="flex flex-wrap gap-2">
              {bucket.map((num, j) => (
                <span
                  key={j}
                  className={`px-2 py-1 rounded ${
                    isDarkMode
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {num}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BucketVisualization;