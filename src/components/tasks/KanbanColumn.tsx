
import { Card } from "@/components/ui/card";
import { Task, KanbanColumn as IKanbanColumn } from "@/types/task";
import { Draggable } from "@hello-pangea/dnd";
import { TaskCard } from "./TaskCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Users, BarChart2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface KanbanColumnProps {
  column: IKanbanColumn;
  provided: any;
  onEditColumn: (columnId: string) => void;
  onDeleteColumn: (columnId: string) => void;
  onManageAccess: (columnId: string) => void;
}

export const KanbanColumn = ({ 
  column, 
  provided, 
  onEditColumn,
  onDeleteColumn,
  onManageAccess
}: KanbanColumnProps) => {
  const tasksInProgress = column.tasks.filter(task => !task.isBlocked).length;
  const blockedTasks = column.tasks.filter(task => task.isBlocked).length;
  
  return (
    <div
      className="bg-white/80 backdrop-blur-sm rounded-lg border border-border p-4 min-h-[500px] flex flex-col"
      ref={provided.innerRef}
      {...provided.droppableProps}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">{column.title}</h3>
            <Badge variant="secondary">{column.tasks.length}</Badge>
          </div>
          <div className="flex gap-2 mt-2 text-sm text-muted-foreground">
            <span>{tasksInProgress} actives</span>
            {blockedTasks > 0 && (
              <span className="text-destructive">{blockedTasks} bloquées</span>
            )}
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEditColumn(column.id)}>
              <Users className="h-4 w-4 mr-2" />
              Gérer les utilisateurs
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onManageAccess(column.id)}>
              <Lock className="h-4 w-4 mr-2" />
              Permissions
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDeleteColumn(column.id)}>
              <BarChart2 className="h-4 w-4 mr-2" />
              Statistiques
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDeleteColumn(column.id)}
            >
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-3 flex-1">
        {column.tasks.map((task, index) => (
          <Draggable key={task.id} draggableId={task.id} index={index}>
            {(provided, snapshot) => (
              <TaskCard
                task={task}
                provided={provided}
                isDragging={snapshot.isDragging}
              />
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </div>

      {column.automations && column.automations.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            {column.automations.length} automation{column.automations.length > 1 ? 's' : ''} active{column.automations.length > 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
};
