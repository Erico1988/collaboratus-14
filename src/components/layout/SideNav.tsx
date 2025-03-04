
import { Home, Briefcase, CheckSquare, PieChart, Users, Settings, ChevronRight, Moon, Sun } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTheme } from '@/styles/ThemeProvider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const menuItems = [
  { name: "Tableau de bord", icon: Home, path: "/" },
  { name: "Marchés", icon: Briefcase, path: "/markets" },
  { name: "Tâches", icon: CheckSquare, path: "/tasks" },
  { name: "Rapports", icon: PieChart, path: "/reports" },
  { name: "Utilisateurs", icon: Users, path: "/users" },
  { name: "Paramètres", icon: Settings, path: "/settings" },
];

interface SideNavProps {
  isOpen: boolean;
}

export const SideNav = ({ isOpen }: SideNavProps) => {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav
      className={cn(
        "bg-card backdrop-blur-sm border-r border-border h-screen transition-all duration-300 ease-in-out overflow-hidden",
        isOpen ? "w-64" : "w-20"
      )}
    >
      <div className={cn(
        "h-16 flex items-center justify-center border-b border-border transition-all duration-300",
        isOpen ? "px-4" : "px-0"
      )}>
        <h1 className={cn(
          "font-bold text-primary transition-all duration-300", 
          isOpen ? "text-xl" : "text-sm"
        )}>
          {isOpen ? "ProcureTrack" : "PT"}
        </h1>
      </div>
      
      <div className={cn("py-4 space-y-2", isOpen ? "px-4" : "px-2")}>
        {menuItems.map((item) => (
          <TooltipProvider key={item.name} delayDuration={400}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start group transition-all duration-200 relative",
                    isActive(item.path) && "bg-primary text-primary-foreground",
                    !isOpen && "justify-center px-0"
                  )}
                  onMouseEnter={() => setHoveredItem(item.name)}
                  onMouseLeave={() => setHoveredItem(null)}
                  asChild
                >
                  <Link to={item.path} className="flex items-center">
                    <item.icon className={cn("h-5 w-5", isOpen ? "mr-2" : "mr-0")} />
                    {isOpen && (
                      <>
                        <span>{item.name}</span>
                        <ChevronRight className={cn(
                          "ml-auto h-4 w-4 opacity-0 transition-all",
                          (hoveredItem === item.name || isActive(item.path)) && "opacity-100"
                        )} />
                      </>
                    )}
                  </Link>
                </Button>
              </TooltipTrigger>
              {!isOpen && (
                <TooltipContent side="right">
                  {item.name}
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>

      <div className={cn(
        "absolute bottom-4 left-0 right-0 px-4 flex justify-center",
        isOpen ? "justify-between" : "justify-center"
      )}>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="rounded-full"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        {isOpen && (
          <span className="text-xs text-muted-foreground self-center">
            {theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
          </span>
        )}
      </div>
    </nav>
  );
};
