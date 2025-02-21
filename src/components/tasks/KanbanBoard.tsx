
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { KanbanColumn } from "./KanbanColumn";
import { useState } from "react";
import { Task, TaskStatus, KanbanColumn as IKanbanColumn } from "@/types/task";
import { toast } from "sonner";

const initialColumns: IKanbanColumn[] = [
  {
    id: "todo",
    title: "À faire",
    tasks: [
      {
        id: "1",
        title: "Analyser les besoins",
        description: "Définir les spécifications détaillées du projet",
        status: "todo",
        priority: "high",
        dueDate: "2024-04-01",
        assigneeName: "Marie Durant",
        createdAt: "2024-03-15",
        updatedAt: "2024-03-15",
      },
      {
        id: "2",
        title: "Préparer l'appel d'offres",
        description: "Rédiger le cahier des charges",
        status: "todo",
        priority: "medium",
        dueDate: "2024-04-15",
        assigneeName: "Jean Martin",
        createdAt: "2024-03-15",
        updatedAt: "2024-03-15",
      },
    ],
  },
  {
    id: "in_progress",
    title: "En cours",
    tasks: [],
  },
  {
    id: "review",
    title: "En révision",
    tasks: [],
  },
  {
    id: "done",
    title: "Terminé",
    tasks: [],
  },
];

export const KanbanBoard = () => {
  const [columns, setColumns] = useState<IKanbanColumn[]>(initialColumns);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === destination.droppableId) {
      // Réorganisation dans la même colonne
      const column = columns.find(col => col.id === source.droppableId);
      if (!column) return;

      const newTasks = Array.from(column.tasks);
      const [removed] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, removed);

      const newColumns = columns.map(col =>
        col.id === source.droppableId ? { ...col, tasks: newTasks } : col
      );

      setColumns(newColumns);
    } else {
      // Déplacement entre colonnes
      const sourceColumn = columns.find(col => col.id === source.droppableId);
      const destColumn = columns.find(col => col.id === destination.droppableId);
      if (!sourceColumn || !destColumn) return;

      const sourceTasks = Array.from(sourceColumn.tasks);
      const destTasks = Array.from(destColumn.tasks);
      const [removed] = sourceTasks.splice(source.index, 1);
      
      // Mettre à jour le statut de la tâche
      const updatedTask = {
        ...removed,
        status: destination.droppableId as TaskStatus,
      };
      
      destTasks.splice(destination.index, 0, updatedTask);

      const newColumns = columns.map(col => {
        if (col.id === source.droppableId) {
          return { ...col, tasks: sourceTasks };
        }
        if (col.id === destination.droppableId) {
          return { ...col, tasks: destTasks };
        }
        return col;
      });

      setColumns(newColumns);
      toast.success(`Tâche déplacée vers ${destColumn.title}`);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => (
          <Droppable key={column.id} droppableId={column.id}>
            {(provided) => (
              <KanbanColumn
                column={column}
                provided={provided}
              />
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};
