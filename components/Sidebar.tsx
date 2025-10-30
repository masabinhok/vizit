'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '../contexts/ThemeContext';
import { ALGORITHM_CATEGORIES, ALGORITHM_NAME_MAP } from '../constants/algorithms';
import ThemeToggle from './ThemeToggle';

interface SidebarProps {
  currentAlgorithm?: string;
}

export default function Sidebar({ currentAlgorithm }: SidebarProps) {
  // Initialize with default state to prevent hydration mismatch
  const [expandedCategories, setExpandedCategories] = useState(new Set(["Algorithms"]));
  const [manuallyExpandedCategories, setManuallyExpandedCategories] = useState(new Set(["Algorithms"]));
  const [isHydrated, setIsHydrated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const isDarkMode = resolvedTheme === 'dark';

  // Hydrate from localStorage after component mounts
  useEffect(() => {
    const savedExpanded = localStorage.getItem('vizit-sidebar-expanded');
    const savedManual = localStorage.getItem('vizit-sidebar-manual-expanded');
    
    if (savedExpanded) {
      try {
        setExpandedCategories(new Set(JSON.parse(savedExpanded)));
      } catch (e) {
        // If parsing fails, keep default
        console.warn('Failed to parse saved expanded categories:', e);
      }
    }
    if (savedManual) {
      try {
        setManuallyExpandedCategories(new Set(JSON.parse(savedManual)));
      } catch (e) {
        // If parsing fails, keep default
        console.warn('Failed to parse saved manual categories:', e);
      }
    }
    
    setIsHydrated(true);
  }, []);

  // Save expanded categories to localStorage (only after hydration)
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('vizit-sidebar-expanded', JSON.stringify([...expandedCategories]));
    }
  }, [expandedCategories, isHydrated]);

  // Save manually expanded categories to localStorage (only after hydration)
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('vizit-sidebar-manual-expanded', JSON.stringify([...manuallyExpandedCategories]));
    }
  }, [manuallyExpandedCategories, isHydrated]);

  // Save and restore scroll position
  useEffect(() => {
    if (!isHydrated) return;
    
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      // Restore scroll position on mount
      const savedScrollTop = localStorage.getItem('vizit-sidebar-scroll');
      if (savedScrollTop) {
        scrollContainer.scrollTop = parseInt(savedScrollTop, 10);
      }

      // Save scroll position on scroll
      const handleScroll = () => {
        localStorage.setItem('vizit-sidebar-scroll', scrollContainer.scrollTop.toString());
      };

      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [isHydrated]);

  // Restore scroll position when expanded categories change (after search or navigation)
  useEffect(() => {
    if (!isHydrated) return;
    
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer && !searchQuery.trim()) {
      // Only restore scroll when not searching to avoid jumping during search
      const savedScrollTop = localStorage.getItem('vizit-sidebar-scroll');
      if (savedScrollTop) {
        setTimeout(() => {
          scrollContainer.scrollTop = parseInt(savedScrollTop, 10);
        }, 100); // Small delay to ensure DOM updates are complete
      }
    }
  }, [expandedCategories, searchQuery, isHydrated]);

  const handleAlgorithmSelect = (algorithmId: string) => {
    // Save current scroll position before navigation (only after hydration)
    if (isHydrated) {
      const scrollContainer = scrollContainerRef.current;
      if (scrollContainer) {
        localStorage.setItem('vizit-sidebar-scroll', scrollContainer.scrollTop.toString());
      }
    }
    
    // Clear search when navigating to maintain clean state
    setSearchQuery("");
    router.push(`/algorithm/${algorithmId}`);
  };

  // Toggle category expansion
  const toggleCategoryExpansion = (categoryName: string) => {
    setManuallyExpandedCategories(prev => {
      const newManuallyExpanded = new Set(prev);
      if (newManuallyExpanded.has(categoryName)) {
        newManuallyExpanded.delete(categoryName);
      } else {
        newManuallyExpanded.add(categoryName);
      }
      return newManuallyExpanded;
    });
  };

  const filteredCategories = useMemo(() => 
    ALGORITHM_CATEGORIES.map(category => ({
      ...category,
      algorithms: category.algorithms.filter(algo =>
        ALGORITHM_NAME_MAP[algo]?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(category => category.algorithms.length > 0),
    [searchQuery]
  );

  // Auto-expand categories with search results
  useEffect(() => {
    // Don't run auto-expansion logic until after hydration
    if (!isHydrated) return;
    
    if (searchQuery.trim()) {
      // Calculate categories with results inside the effect to avoid dependency issues
      const categoriesWithResults = ALGORITHM_CATEGORIES
        .filter(category => 
          category.algorithms.some(algo =>
            ALGORITHM_NAME_MAP[algo]?.toLowerCase().includes(searchQuery.toLowerCase())
          )
        )
        .map(cat => cat.name);
      
      // Combine manually expanded categories with search result categories
      const combinedExpanded = new Set([...manuallyExpandedCategories, ...categoriesWithResults]);
      setExpandedCategories(combinedExpanded);
    } else {
      // When not searching, restore manually expanded categories
      setExpandedCategories(new Set(manuallyExpandedCategories));
    }
  }, [searchQuery, manuallyExpandedCategories, isHydrated]); // Added isHydrated dependency

  // Get categories to display (filtered when searching, all when not)
  const categoriesToDisplay = searchQuery.trim() 
    ? filteredCategories 
    : ALGORITHM_CATEGORIES;

  // Count total filtered algorithms
  const totalFilteredAlgorithms = filteredCategories.reduce((sum, cat) => sum + cat.algorithms.length, 0);

  // Clear search function
  const clearSearch = () => setSearchQuery("");

  // Get search results summary
  const getSearchSummary = () => {
    if (!searchQuery) return null;
    return `${totalFilteredAlgorithms} algorithm${totalFilteredAlgorithms !== 1 ? 's' : ''} found`;
  };

  return (
    <aside className={`w-72 sticky top-0 h-screen ${
      isDarkMode 
        ? 'bg-gradient-to-b from-slate-900/95 to-slate-800/95 text-white' 
        : 'bg-gradient-to-b from-white/95 to-gray-50/95 text-gray-900'
    } backdrop-blur-xl border-r ${
      isDarkMode ? 'border-slate-700/50' : 'border-gray-200/50'
    } flex flex-col shadow-2xl`}>
      
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none" />
      
      {/* Header */}
      <div className={`relative p-4 flex-shrink-0 border-b ${
        isDarkMode ? 'border-white/10' : 'border-gray-500/30'
      }`}>
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-3 mb-2 w-full text-left group hover:scale-102 hover:-translate-y-0.5 transition-all duration-200 ease-out"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-blue-500/25 transition-all duration-200 ease-out group-hover:scale-105">
            <svg className="w-6 h-6 text-white group-hover:rotate-6 transition-transform duration-200 ease-out" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-200 ease-out">
              Vizit
            </h1>
            <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-400 group-hover:text-slate-300' : 'text-gray-500 group-hover:text-gray-400'} tracking-wide uppercase transition-colors duration-200 ease-out`}>
              Visualize It
            </p>
          </div>
        </button>
        
        {/* GitHub Star Button */}
        <a
          href="https://github.com/masabinhok/vizit"
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ease-out ${
            isDarkMode 
              ? 'bg-gradient-to-r from-slate-800/60 to-slate-700/60 text-slate-300 hover:from-slate-700/70 hover:to-slate-600/70 border border-slate-600/30 hover:border-slate-500/50' 
              : 'bg-gradient-to-r from-gray-100/80 to-white/80 text-gray-700 hover:from-gray-200/80 hover:to-gray-100/80 border border-gray-300/30 hover:border-gray-400/40'
          } backdrop-blur-sm hover:shadow-lg hover:scale-102 hover:-translate-y-0.5 group`}
          aria-label="Star Vizit on GitHub"
        >
          <svg 
            className="w-4 h-4 transition-transform duration-200 ease-out group-hover:rotate-6" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          <span>Star on GitHub</span>
          <svg 
            className="w-3 h-3 transition-transform duration-200 ease-out group-hover:translate-x-0.5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      {/* Search Bar */}
      <div className="relative p-3 flex-shrink-0">
        <div className="relative group">
          <div className={`absolute inset-0 rounded-2xl ${
            isDarkMode 
              ? 'bg-gradient-to-r from-slate-800/50 to-slate-700/50' 
              : 'bg-gradient-to-r from-white/80 to-gray-50/80'
          } backdrop-blur-sm transition-all duration-200 ease-out group-focus-within:from-blue-500/10 group-focus-within:to-purple-500/10`} />
          <input
            type="text"
            placeholder="Search algorithms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`relative w-full px-5 py-4 pr-12 rounded-2xl border ${
              isDarkMode 
                ? 'bg-slate-800/30 border-slate-600/30 text-white placeholder-slate-400' 
                : 'bg-white/50 border-gray-300/30 text-gray-900 placeholder-gray-500'
            } focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 ease-out text-sm font-medium backdrop-blur-sm`}
          />
          
          {/* Search/Clear button */}
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            {searchQuery ? (
              <button
                onClick={clearSearch}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isDarkMode 
                    ? 'hover:bg-slate-600/50 text-slate-400 hover:text-slate-200 bg-slate-700/50' 
                    : 'hover:bg-gray-200/50 text-gray-400 hover:text-gray-600 bg-gray-100/50'
                }`}
                title="Clear search"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ) : (
              <div className={`p-2 rounded-lg ${
                isDarkMode ? 'bg-slate-700/50' : 'bg-gray-100/50'
              } transition-colors duration-200`}>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            )}
          </div>
        </div>
        
        {/* Search results summary */}
        {searchQuery && (
          <div className={`mt-3 text-xs font-medium flex items-center justify-between ${
            isDarkMode ? 'text-slate-400' : 'text-gray-500'
          }`}>
            <span>{getSearchSummary()}</span>
            {totalFilteredAlgorithms === 0 && (
              <span className={`px-2 py-1 rounded-lg ${
                isDarkMode ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-500/10 text-amber-600'
              }`}>
                No matches
              </span>
            )}
          </div>
        )}
      </div>

      {/* Categories */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent hover:scrollbar-thumb-gray-500 dark:scrollbar-thumb-gray-600 dark:hover:scrollbar-thumb-gray-500 px-2">
        {searchQuery && totalFilteredAlgorithms === 0 ? (
          /* No search results */
          <div className="flex flex-col items-center justify-center py-12 px-6">
            <div className={`w-16 h-16 rounded-2xl mb-4 flex items-center justify-center ${
              isDarkMode ? 'bg-slate-800/50' : 'bg-gray-100/50'
            }`}>
              <svg className={`w-8 h-8 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className={`text-lg text-center font-semibold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              No algorithms found
            </h3>
            <p className={`text-sm text-center leading-relaxed mb-4 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              We couldn&apos;t find any algorithms matching &quot;<span className="font-medium text-blue-500">{searchQuery}</span>&quot;. 
              Try a different search term.
            </p>
            <button
              onClick={clearSearch}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 hover:text-white' 
                  : 'bg-gray-100/80 text-gray-700 hover:bg-gray-200/80 hover:text-gray-900'
              }`}
            >
              Clear search
            </button>
          </div>
        ) : (
          /* Normal categories view */
          <div className="space-y-0.5">
            {categoriesToDisplay.map((category) => {
              const isExpanded = expandedCategories.has(category.name);
              const isManuallyExpanded = manuallyExpandedCategories.has(category.name);
              const isAutoExpanded = isExpanded && !isManuallyExpanded && searchQuery.trim();
              // When searching, show filtered algorithms; when not searching, show all algorithms in expanded categories
              const algorithmsToShow = searchQuery.trim() ? category.algorithms : (isExpanded ? category.algorithms : []);
              
              return (
              <div key={category.name} className="group">
                <button
                  onClick={() => toggleCategoryExpansion(category.name)}
                  className={`w-full text-left font-semibold px-2 py-2 rounded-lg transition-all duration-300 relative overflow-hidden ${
                    isExpanded
                      ? `${isDarkMode 
                          ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 shadow-lg shadow-blue-500/10' 
                          : 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 shadow-lg shadow-blue-500/20'
                        } backdrop-blur-sm border ${isAutoExpanded ? 'border-amber-500/30' : 'border-blue-500/20'}`
                      : `${isDarkMode 
                          ? 'hover:bg-gradient-to-r hover:from-slate-700/50 hover:to-slate-600/50 text-slate-300' 
                          : 'hover:bg-gradient-to-r hover:from-gray-100/80 hover:to-gray-50/80 text-gray-700'
                        } hover:shadow-md border border-transparent`
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold tracking-wide">
                      {category.name}
                      {searchQuery.trim() && category.algorithms.length > 0 && (
                        <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                          isDarkMode 
                            ? 'bg-blue-500/20 text-blue-300' 
                            : 'bg-blue-500/10 text-blue-600'
                        }`}>
                          {category.algorithms.length}
                        </span>
                      )}
                    </span>
                    <div className={`transform transition-transform duration-300 ${
                      isExpanded ? 'rotate-90' : 'rotate-0'
                    }`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 animate-pulse" />
                  )}
                </button>
                
                {(isExpanded || (searchQuery.trim() && category.algorithms.length > 0)) && (
                  <div className="ml-1 -mt-1 no-space-y animate-in slide-in-from-left-4 fade-in duration-300">
                    {algorithmsToShow.map((algorithmId, algorithmIndex) => (
                      <button 
                        key={algorithmId}
                        onClick={() => handleAlgorithmSelect(algorithmId)}
                        className={`group/item w-full text-left px-2 py-1.5 text-sm rounded-lg transition-all duration-300 relative overflow-hidden ${
                          currentAlgorithm === algorithmId
                            ? `${isDarkMode 
                                ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-emerald-300 shadow-md shadow-emerald-500/10' 
                                : 'bg-gradient-to-r from-emerald-500/10 to-blue-500/10 text-emerald-700 shadow-md shadow-emerald-500/20'
                              } backdrop-blur-sm border border-emerald-500/20 font-medium`
                            : `${isDarkMode 
                                ? 'hover:bg-gradient-to-r hover:from-slate-700/30 hover:to-slate-600/30 text-slate-400 hover:text-slate-200' 
                                : 'hover:bg-gradient-to-r hover:from-gray-50/80 hover:to-white/80 text-gray-600 hover:text-gray-800'
                              } hover:shadow-sm border border-transparent hover:border-gray-200/20`
                        } transform hover:translate-x-1`}
                        style={{
                          animationDelay: `${algorithmIndex * 50}ms`
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{ALGORITHM_NAME_MAP[algorithmId]}</span>
                          {currentAlgorithm === algorithmId && (
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          )}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover/item:from-blue-500/5 group-hover/item:to-purple-500/5 rounded-xl transition-all duration-300" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
            })}
          </div>
        )}
      </div>

      {/* Theme Toggle - Minimal */}
      <div className={`relative p-3 flex-shrink-0 border-t ${
        isDarkMode ? 'border-white/10' : 'border-gray-500/30'
      }`}>
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
            Theme
          </span>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}