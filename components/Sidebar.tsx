'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ALGORITHM_CATEGORIES, ALGORITHM_NAME_MAP } from '../constants/algorithms';

interface SidebarProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  currentAlgorithm?: string;
}

export default function Sidebar({ isDarkMode, setIsDarkMode, currentAlgorithm }: SidebarProps) {
  const [selectedCategory, setSelectedCategory] = useState("Algorithms");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleAlgorithmSelect = (algorithmId: string) => {
    router.push(`/algorithm/${algorithmId}`);
  };

  const filteredCategories = ALGORITHM_CATEGORIES.map(category => ({
    ...category,
    algorithms: category.algorithms.filter(algo =>
      ALGORITHM_NAME_MAP[algo]?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.algorithms.length > 0);

  return (
    <aside className={`w-64 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} shadow-lg flex flex-col`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-blue-600">Vizit</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Algorithm Visualizer</p>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <input
            type="text"
            placeholder="Search algorithms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full px-3 py-2 rounded-lg border ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-gray-50 border-gray-300 text-gray-900'
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
          <svg className="w-4 h-4 absolute right-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto">
        {filteredCategories.map((category) => (
          <div key={category.name} className="p-4 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setSelectedCategory(category.name)}
              className={`w-full text-left font-semibold mb-3 px-2 py-1 rounded ${
                selectedCategory === category.name
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {category.name}
            </button>
            {selectedCategory === category.name && (
              <ul className="space-y-1 ml-2">
                {category.algorithms.map((algorithmId) => (
                  <li key={algorithmId}>
                    <button 
                      onClick={() => handleAlgorithmSelect(algorithmId)}
                      className={`w-full text-left px-2 py-1 text-sm rounded transition-colors ${
                        currentAlgorithm === algorithmId
                          ? 'bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {ALGORITHM_NAME_MAP[algorithmId]}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Dark/Light Mode Toggle */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors ${
            isDarkMode
              ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400'
              : 'bg-gray-800 text-white hover:bg-gray-700'
          }`}
        >
          {isDarkMode ? (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
              Light Mode
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
              Dark Mode
            </>
          )}
        </button>
      </div>
    </aside>
  );
}