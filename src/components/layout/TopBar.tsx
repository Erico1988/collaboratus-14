
import { Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface TopBarProps {
  onToggleSidebar: () => void;
}

export const TopBar = ({ onToggleSidebar }: TopBarProps) => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-border h-16 flex items-center px-6 sticky top-0 z-10">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleSidebar}
        className="mr-4"
      >
        <Menu className="h-5 w-5" />
      </Button>
      <h1 className="text-xl font-semibold">ProcureTrack</h1>
    </header>
  );
};
