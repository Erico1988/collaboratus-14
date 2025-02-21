
import { useState } from 'react';
import { SideNav } from './SideNav';
import { TopBar } from './TopBar';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      <SideNav isOpen={sidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar onToggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
