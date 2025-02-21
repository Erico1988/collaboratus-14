
import { Home, Briefcase, CheckSquare, PieChart, Users, Settings } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

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
  return (
    <nav
      className={cn(
        "bg-white/80 backdrop-blur-sm border-r border-border w-64 flex-shrink-0 transition-all duration-300 ease-in-out overflow-y-auto",
        !isOpen && "-translate-x-full"
      )}
    >
      <div className="h-16 flex items-center justify-center border-b border-border">
        <h1 className="text-xl font-bold text-primary">ProcureTrack</h1>
      </div>
      <div className="p-4 space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.name}
            variant="ghost"
            className="w-full justify-start"
            asChild
          >
            <Link to={item.path}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.name}
            </Link>
          </Button>
        ))}
      </div>
    </nav>
  );
};
