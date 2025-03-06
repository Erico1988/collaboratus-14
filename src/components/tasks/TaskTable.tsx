
import { Task, TaskPriority, TaskStatus } from "@/types/task";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface TaskTableProps {
  tasks: Task[];
}

const priorityColors: Record<TaskPriority, string> = {
  low: "bg-green-500",
  medium: "bg-yellow-500",
  high: "bg-blue-500",
  urgent: "bg-red-500",
};

const statusColors: Record<TaskStatus, string> = {
  todo: "bg-slate-500",
  in_progress: "bg-blue-500",
  review: "bg-yellow-500",
  done: "bg-green-500",
  pending: "bg-purple-500",
  rejected: "bg-red-500",
  assigned: "bg-sky-500",
};

export const TaskTable = ({ tasks }: TaskTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tâche</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Priorité</TableHead>
          <TableHead>Assigné à</TableHead>
          <TableHead>Date d'échéance</TableHead>
          <TableHead>Dépendances</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell className="font-medium">{task.title}</TableCell>
            <TableCell>
              <Badge className={statusColors[task.status]}>
                {task.status === 'todo' && 'À faire'}
                {task.status === 'in_progress' && 'En cours'}
                {task.status === 'review' && 'En révision'}
                {task.status === 'done' && 'Terminé'}
                {task.status === 'pending' && 'En attente'}
                {task.status === 'rejected' && 'Rejeté'}
                {task.status === 'assigned' && 'Assigné'}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge className={priorityColors[task.priority]}>
                {task.priority === 'low' && 'Basse'}
                {task.priority === 'medium' && 'Moyenne'}
                {task.priority === 'high' && 'Haute'}
                {task.priority === 'urgent' && 'Urgente'}
              </Badge>
            </TableCell>
            <TableCell>{task.assigneeName || '-'}</TableCell>
            <TableCell>
              {format(new Date(task.dueDate), 'dd MMM yyyy', { locale: fr })}
            </TableCell>
            <TableCell>
              {task.dependsOn?.length 
                ? tasks
                    .filter(t => task.dependsOn?.includes(t.id))
                    .map(t => t.title)
                    .join(', ')
                : '-'
              }
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
