
import { Button } from "@/components/ui/button";
import { PlusCircle, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface KanbanHeaderProps {
  onAddColumn: () => void;
  onManageWorkflow: () => void;
  onViewAnalytics: () => void;
}

export const KanbanHeader = ({
  onAddColumn,
  onManageWorkflow,
  onViewAnalytics,
}: KanbanHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex gap-4">
        <Button onClick={onAddColumn} variant="outline">
          <PlusCircle className="h-4 w-4 mr-2" />
          Ajouter une colonne
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Workflow
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Configuration</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onManageWorkflow}>
              Gérer le workflow
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onViewAnalytics}>
              Voir les analyses
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
