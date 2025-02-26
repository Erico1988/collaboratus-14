
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { KanbanColumn } from "./KanbanColumn";
import { useState } from "react";
import { KanbanColumn as IKanbanColumn, TaskStatus } from "@/types/task";
import { toast } from "sonner";
import { KanbanHeader } from "./KanbanHeader";
import { ColumnDialog } from "./ColumnDialog";
import { WorkflowDialog } from "./WorkflowDialog";
import { MarketFilter } from "./filters/MarketFilter";
import { initialColumns } from "@/data/initialKanbanData";

export const KanbanBoard = () => {
  const [columns, setColumns] = useState<IKanbanColumn[]>(initialColumns);
  const [columnDialogOpen, setColumnDialogOpen] = useState(false);
  const [workflowDialogOpen, setWorkflowDialogOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<IKanbanColumn | undefined>();
  const [selectedMarketId, setSelectedMarketId] = useState<string>("");

  const filteredColumns = columns.map(column => ({
    ...column,
    tasks: column.tasks.filter(task => 
      !selectedMarketId || task.marketId === selectedMarketId
    )
  }));

  const handleAddColumn = () => {
    setSelectedColumn(undefined);
    setColumnDialogOpen(true);
  };

  const handleEditColumn = (columnId: string) => {
    const column = columns.find((col) => col.id === columnId);
    if (column) {
      setSelectedColumn(column);
      setColumnDialogOpen(true);
    }
  };

  const handleDeleteColumn = (columnId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette colonne ?")) {
      const newColumns = columns.filter((col) => col.id !== columnId);
      setColumns(newColumns);
      toast.success("Colonne supprimée avec succès");
    }
  };

  const handleManageAccess = (columnId: string) => {
    toast.info("Fonctionnalité en cours de développement");
  };

  const handleColumnSubmit = (data: any) => {
    if (selectedColumn) {
      // Mise à jour d'une colonne existante
      const updatedColumns = columns.map((col) =>
        col.id === selectedColumn.id
          ? { ...col, ...data, id: col.id }
          : col
      );
      setColumns(updatedColumns);
      toast.success("Colonne mise à jour avec succès");
    } else {
      // Création d'une nouvelle colonne
      const newColumn: IKanbanColumn = {
        id: `column-${Date.now()}` as TaskStatus,
        tasks: [],
        ...data
      };
      setColumns([...columns, newColumn]);
      toast.success("Colonne créée avec succès");
    }
  };

  const handleWorkflowSubmit = (data: any) => {
    const updatedColumns = columns.map(col => ({
      ...col,
      automations: data.automations[col.id] || []
    }));
    setColumns(updatedColumns);
    toast.success("Workflow mis à jour avec succès");
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
      <div className="flex justify-between items-center mb-6">
        <KanbanHeader
          onAddColumn={handleAddColumn}
          onManageWorkflow={() => setWorkflowDialogOpen(true)}
          onViewAnalytics={() => toast.info("Fonctionnalité en cours de développement")}
        />
        <MarketFilter
          selectedMarketId={selectedMarketId}
          onMarketChange={setSelectedMarketId}
        />
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredColumns.map((column) => (
            <Droppable key={column.id} droppableId={column.id}>
              {(provided) => (
                <KanbanColumn
                  column={column}
                  provided={provided}
                  onEditColumn={() => handleEditColumn(column.id)}
                  onDeleteColumn={() => handleDeleteColumn(column.id)}
                  onManageAccess={() => handleManageAccess(column.id)}
                />
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <ColumnDialog
        open={columnDialogOpen}
        onOpenChange={setColumnDialogOpen}
        onSubmit={handleColumnSubmit}
        column={selectedColumn}
      />

      <WorkflowDialog
        open={workflowDialogOpen}
        onOpenChange={setWorkflowDialogOpen}
        onSubmit={handleWorkflowSubmit}
        columns={columns}
      />
    </div>
  );
};
