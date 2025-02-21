
import { Card } from "@/components/ui/card";
import { Task } from "@/types/task";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { AlertCircle, Calendar, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  provided: any;
  isDragging: boolean;
}

const priorityColors = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
};

const priorityLabels = {
  low: "Basse",
  medium: "Moyenne",
  high: "Haute",
  urgent: "Urgente",
};

export const TaskCard = ({ task, provided, isDragging }: TaskCardProps) => {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <Card
        className={cn(
          "p-4 cursor-grab active:cursor-grabbing transition-all duration-200",
          isDragging && "shadow-lg scale-105"
        )}
      >
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h4 className="font-medium line-clamp-2">{task.title}</h4>
            <span
              className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                priorityColors[task.priority]
              )}
            >
              {priorityLabels[task.priority]}
            </span>
          </div>
          
          <div className="text-sm text-muted-foreground space-y-2">
            {task.assigneeName && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{task.assigneeName}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {format(new Date(task.dueDate), "d MMMM yyyy", { locale: fr })}
              </span>
            </div>

            {task.isBlocked && (
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>Bloquée</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
