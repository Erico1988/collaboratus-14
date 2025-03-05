
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Task } from "@/types/task";
import { TaskForm } from "./TaskForm";
import { markets } from "@/data/markets";

interface TaskDialogProps {
  task?: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TaskDialog = ({ task, open, onOpenChange }: TaskDialogProps) => {
  const handleSubmit = async (data: any) => {
    console.log("Soumission du formulaire :", data);
    // TODO: Implémenter la soumission vers l'API
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>
            {task ? "Modifier la tâche" : "Nouvelle tâche"}
          </DialogTitle>
        </DialogHeader>
        <TaskForm 
          task={task}
          markets={markets}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
