
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { KanbanColumn } from "./KanbanColumn";
import { useState } from "react";
import { Task, TaskStatus, KanbanColumn as IKanbanColumn } from "@/types/task";
import { toast } from "sonner";
import { KanbanHeader } from "./KanbanHeader";

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
        comments: [
          {
            id: "c1",
            taskId: "1",
            userId: "u1",
            userName: "Jean Martin",
            content: "N'oubliez pas d'inclure les spécifications techniques",
            createdAt: "2024-03-15",
            updatedAt: "2024-03-15"
          }
        ],
        attachments: ["spec.pdf"]
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
        dependsOn: ["1"],
        isBlocked: true
      },
    ],
    automations: [
      {
        id: "auto1",
        trigger: "deadline_approaching",
        action: "send_notification",
        parameters: { days: 2 }
      }
    ]
  },
  {
    id: "in_progress",
    title: "En cours",
    tasks: [],
    roleAccess: ["developer", "manager"]
  },
  {
    id: "review",
    title: "En révision",
    tasks: [],
    automations: [
      {
        id: "auto2",
        trigger: "status_change",
        action: "change_status",
        parameters: { after: "48h", newStatus: "done" }
      }
    ]
  },
  {
    id: "done",
    title: "Terminé",
    tasks: [],
  },
];

export const KanbanBoard = () => {
  const [columns, setColumns] = useState<IKanbanColumn[]>(initialColumns);

  const handleAddColumn = () => {
    // TODO: Implémenter l'ajout de colonne
    toast.info("Fonctionnalité en cours de développement");
  };

  const handleManageWorkflow = () => {
    // TODO: Implémenter la gestion du workflow
    toast.info("Fonctionnalité en cours de développement");
  };

  const handleViewAnalytics = () => {
    // TODO: Implémenter la vue des analyses
    toast.info("Fonctionnalité en cours de développement");
  };

  const handleEditColumn = (columnId: string) => {
    // TODO: Implémenter l'édition de colonne
    toast.info("Fonctionnalité en cours de développement");
  };

  const handleDeleteColumn = (columnId: string) => {
    // TODO: Implémenter la suppression de colonne
    toast.info("Fonctionnalité en cours de développement");
  };

  const handleManageAccess = (columnId: string) => {
    // TODO: Implémenter la gestion des accès
    toast.info("Fonctionnalité en cours de développement");
  };

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
        updatedAt: new Date().toISOString()
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
      
      // Vérifier et exécuter les automatisations
      const automations = destColumn.automations;
      if (automations?.length) {
        toast.success(`${automations.length} automation(s) seront exécutée(s)`);
      }

      toast.success(`Tâche déplacée vers ${destColumn.title}`);
    }
  };

  return (
    <div className="space-y-6">
      <KanbanHeader
        onAddColumn={handleAddColumn}
        onManageWorkflow={handleManageWorkflow}
        onViewAnalytics={handleViewAnalytics}
      />

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((column) => (
            <Droppable key={column.id} droppableId={column.id}>
              {(provided) => (
                <KanbanColumn
                  column={column}
                  provided={provided}
                  onEditColumn={handleEditColumn}
                  onDeleteColumn={handleDeleteColumn}
                  onManageAccess={handleManageAccess}
                />
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};
