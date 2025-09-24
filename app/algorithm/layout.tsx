'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '../../components/Sidebar';

export default function AlgorithmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Extract the algorithm ID from the pathname
  const pathParts = pathname.split('/');
  const currentAlgorithm = pathParts[pathParts.length - 1];

  return (
    <div className="flex h-screen animate-in fade-in duration-800">
      {/* Persistent Sidebar */}
      <div className="animate-in slide-in-from-left-4 fade-in duration-600">
        <Sidebar currentAlgorithm={currentAlgorithm} />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 min-h-0 animate-in slide-in-from-right-4 fade-in duration-600 delay-100">
        {children}
      </div>
    </div>
  );
}