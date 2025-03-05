
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Task } from "@/types/task";
import { Market } from "@/types/market";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, Clock, Link, Paperclip, Tag, User, AlertCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskDialog } from "./TaskDialog";
import { useState } from "react";

interface TaskDetailProps {
  task: Task;
  markets: Market[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case "todo": return "À faire";
    case "in_progress": return "En cours";
    case "review": return "En révision";
    case "done": return "Terminé";
    case "pending": return "En attente";
    case "rejected": return "Rejeté";
    case "assigned": return "Assigné";
    default: return status;
  }
};

const getPriorityLabel = (priority: string) => {
  switch (priority) {
    case "low": return "Basse";
    case "medium": return "Moyenne";
    case "high": return "Haute";
    case "urgent": return "Urgente";
    default: return priority;
  }
};

const priorityColors: Record<string, string> = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
};

const statusColors: Record<string, string> = {
  todo: "bg-slate-100 text-slate-800",
  in_progress: "bg-blue-100 text-blue-800",
  review: "bg-yellow-100 text-yellow-800",
  done: "bg-green-100 text-green-800",
  pending: "bg-purple-100 text-purple-800",
  rejected: "bg-red-100 text-red-800",
  assigned: "bg-sky-100 text-sky-800",
};

export const TaskDetail = ({ task, markets, open, onOpenChange }: TaskDetailProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const market = markets.find(m => m.id === task.marketId);
  
  const handleEdit = () => {
    onOpenChange(false);
    setIsEditDialogOpen(true);
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="text-xl">{task.title}</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <p className="text-muted-foreground">{task.description}</p>
              </div>
              
              {task.isBlocked && (
                <div className="flex items-start gap-2 text-destructive bg-destructive/10 p-3 rounded-md">
                  <AlertCircle className="h-5 w-5 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Tâche bloquée</h4>
                    <p className="text-sm">Cette tâche est bloquée par des dépendances non résolues.</p>
                  </div>
                </div>
              )}
              
              {task.dependsOn && task.dependsOn.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Dépendances</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {task.dependsOn.map(depId => (
                      <li key={depId}>{depId}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {task.comments && task.comments.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Commentaires</h3>
                  <div className="space-y-3">
                    {task.comments.map(comment => (
                      <div key={comment.id} className="bg-muted p-3 rounded-md">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{comment.userName}</span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(comment.createdAt), "d MMM yyyy à HH:mm", { locale: fr })}
                          </span>
                        </div>
                        <p>{comment.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {task.attachments && task.attachments.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Pièces jointes</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {task.attachments.map((attachment, index) => (
                      <li key={index} className="flex items-center gap-1">
                        <Paperclip className="h-4 w-4" />
                        <span>{attachment}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2 text-muted-foreground">Détails</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Tag className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Statut</p>
                      <Badge className={statusColors[task.status]}>
                        {getStatusLabel(task.status)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Tag className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Priorité</p>
                      <Badge className={priorityColors[task.priority]}>
                        {getPriorityLabel(task.priority)}
                      </Badge>
                    </div>
                  </div>
                  
                  {task.assigneeName && (
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Assigné à</p>
                        <p className="font-medium">{task.assigneeName}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Date d'échéance</p>
                      <p className="font-medium">
                        {format(new Date(task.dueDate), "d MMMM yyyy", { locale: fr })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Link className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Marché associé</p>
                      <p className="font-medium">{market?.title || "Non spécifié"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Créée le</p>
                      <p className="font-medium">
                        {format(new Date(task.createdAt), "d MMMM yyyy", { locale: fr })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex flex-col gap-2">
                <Button onClick={handleEdit}>Modifier</Button>
                <Button variant="outline">Ajouter un commentaire</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <TaskDialog
        task={task}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </>
  );
};
