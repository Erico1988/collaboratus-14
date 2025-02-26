
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Task, Market } from "@/types/task";
import { TaskForm } from "./TaskForm";
import { useState } from "react";

interface TaskDialogProps {
  task?: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Données de test pour les marchés (à remplacer par les données réelles)
const mockMarkets: Pick<Market, 'id' | 'title'>[] = [
  { id: "1", title: "Développement ProcureTrack" },
  // Ajoutez d'autres marchés au besoin
];

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
          markets={mockMarkets}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
