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
    <div className="flex h-screen">
      {/* Persistent Sidebar */}
      <Sidebar currentAlgorithm={currentAlgorithm} />
      
      {/* Main Content Area */}
      <div className="flex-1 min-h-0">
        {children}
      </div>
    </div>
  );
}