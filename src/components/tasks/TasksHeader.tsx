
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface TasksHeaderProps {
  onCreateTask: () => void;
}

export const TasksHeader = ({ onCreateTask }: TasksHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">ProcureTrack - Planning</h1>
      <Button onClick={onCreateTask}>
        <Plus className="mr-2 h-4 w-4" />
        Nouvelle Tâche
      </Button>
    </div>
  );
};
