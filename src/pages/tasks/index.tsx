
import { MainLayout } from "@/components/layout/MainLayout";
import { KanbanBoard } from "@/components/tasks/KanbanBoard";
import { GanttChart } from "@/components/tasks/GanttChart";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TaskDialog } from "@/components/tasks/TaskDialog";
import { Task } from "@/types/task";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Données de test en attendant l'intégration avec l'API
const mockTasks: Task[] = [
  {
    id: "1",
    title: "Conception de l'interface",
    description: "Créer les maquettes de l'application",
    status: "done",
    priority: "high",
    dueDate: "2024-03-20",
    createdAt: "2024-03-01",
    updatedAt: "2024-03-01",
  },
  {
    id: "2",
    title: "Développement du backend",
    description: "Implémenter l'API REST",
    status: "in_progress",
    priority: "urgent",
    dueDate: "2024-03-25",
    dependsOn: ["1"],
    createdAt: "2024-03-05",
    updatedAt: "2024-03-05",
  },
  {
    id: "3",
    title: "Tests d'intégration",
    description: "Écrire et exécuter les tests",
    status: "todo",
    priority: "medium",
    dueDate: "2024-03-30",
    dependsOn: ["2"],
    createdAt: "2024-03-10",
    updatedAt: "2024-03-10",
  }
];

const TasksPage = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Gestion des Tâches</h1>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle Tâche
          </Button>
        </div>

        <Tabs defaultValue="kanban" className="space-y-4">
          <TabsList>
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
            <TabsTrigger value="gantt">Gantt</TabsTrigger>
          </TabsList>
          <TabsContent value="kanban">
            <KanbanBoard />
          </TabsContent>
          <TabsContent value="gantt">
            <GanttChart tasks={mockTasks} />
          </TabsContent>
        </Tabs>

        <TaskDialog 
          open={isCreateDialogOpen} 
          onOpenChange={setIsCreateDialogOpen}
        />
      </div>
    </MainLayout>
  );
};

export default TasksPage;
