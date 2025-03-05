
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
import { AlertCircle, BarChart2, Lock, MoreHorizontal, Settings, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface KanbanColumnProps {
  column: IKanbanColumn;
  provided: any;
  onEditColumn: (columnId: string) => void;
  onDeleteColumn: (columnId: string) => void;
  onManageAccess: (columnId: string) => void;
  onTaskSelect?: (task: Task) => void;
}

export const KanbanColumn = ({ 
  column, 
  provided, 
  onEditColumn,
  onDeleteColumn,
  onManageAccess,
  onTaskSelect
}: KanbanColumnProps) => {
  const tasksInProgress = column.tasks.filter(task => !task.isBlocked).length;
  const blockedTasks = column.tasks.filter(task => task.isBlocked).length;
  const hasWipLimit = column.wip?.max !== undefined;
  const isOverWipLimit = hasWipLimit && tasksInProgress > (column.wip?.max || 0);
  
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
            <Badge variant={isOverWipLimit ? "destructive" : "secondary"}>
              {tasksInProgress} / {column.wip?.max || "∞"}
            </Badge>
          </div>
          <div className="flex gap-2 mt-2 text-sm text-muted-foreground">
            {hasWipLimit && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center gap-1">
                      <Settings className="h-4 w-4" />
                      <span>WIP: {tasksInProgress}/{column.wip?.max}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Limite de travail en cours</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {blockedTasks > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center gap-1 text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      <span>{blockedTasks} bloquée(s)</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Tâches bloquées par des dépendances</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Options de la colonne</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEditColumn(column.id)}>
              <Users className="h-4 w-4 mr-2" />
              Gérer les utilisateurs
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onManageAccess(column.id)}>
              <Lock className="h-4 w-4 mr-2" />
              Permissions
              {column.roleAccess && (
                <Badge variant="secondary" className="ml-auto">
                  {column.roleAccess.length}
                </Badge>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <BarChart2 className="h-4 w-4 mr-2" />
              Statistiques
            </DropdownMenuItem>
            {column.automations && column.automations.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Automatisations</DropdownMenuLabel>
                {column.automations.map((auto) => (
                  <DropdownMenuItem key={auto.id}>
                    <Settings className="h-4 w-4 mr-2" />
                    {auto.trigger} → {auto.action}
                  </DropdownMenuItem>
                ))}
              </>
            )}
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
              <div onClick={() => onTaskSelect && onTaskSelect(task)}>
                <TaskCard
                  task={task}
                  provided={provided}
                  isDragging={snapshot.isDragging}
                />
              </div>
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </div>

      {(column.policies?.requireApproval || column.automations?.length > 0) && (
        <div className="mt-4 pt-4 border-t border-border">
          {column.policies?.requireApproval && (
            <Badge variant="secondary" className="mb-2">
              Approbation requise
            </Badge>
          )}
          {column.automations && column.automations.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {column.automations.length} automation{column.automations.length > 1 ? 's' : ''} active{column.automations.length > 1 ? 's' : ''}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
